// ======================================================================
// AI의 전략 평가 함수 모듈 (도로 우선, 자원 확보, 도시 러시 등)
// ----------------------------------------------------------------------
// - 이 모듈은 "AI의 성향"을 정의합니다.
// - 각 전략 객체는 필요한 메서드만 구현하면 됩니다:
//     * scoreAction(state, ai, action, helpers) → number
//     * chooseRobberTarget(state, ai, basePick) → { targetTileId, victimId }
//     * preRollAdjustments(state, ai) → void
// - 여러 전략을 합성해(가산/변형) 사용할 수 있도록 composeStrategies 제공.
//
// 액션 포맷 예시:
//   { type: 'BUILD_SETTLEMENT', location, spot }
//   { type: 'BUILD_ROAD', edge }
//   { type: 'UPGRADE_CITY', location }
//   { type: 'BUY_DEV_CARD' }
//   { type: 'END_TURN' }
//
// helpers (aiAgent에서 주입):
//   - NUM_WEIGHT: 숫자-기대치 가중치 맵(예: {6:5, 8:5, ...})
//   - scoreSettlementSpot(spot, tilesById), scoreCityUpgrade(building, tilesById)
//   - resourceStats(ai): { diversity, counts }
//   - hasCost(ai.resources, COSTS.*), tryBankTrades(...), missingFor(...)
// ======================================================================

/* --------------------------- 공통 유틸/헬퍼 --------------------------- */

/** 플레이어 보유 전체 카드 수(강탈 우선순위 등) */
function totalCards(resources = {}) {
  return Object.values(resources).reduce((a, b) => a + (b || 0), 0);
}

/** 보유 자원의 '종류 수'(다양성 지표) */
function resourceDiversity(resources = {}) {
  return Object.keys(resources).filter((k) => (resources[k] || 0) > 0).length;
}

/** 특정 자원 보유 개수 */
function countOf(resources = {}, type) {
  return resources?.[type] || 0;
}

/**
 * 아주 단순한 연결성 보너스(옵션):
 * - edge(a,b)가 내 도로 네트워크에 붙으면 +3
 * - 실제 프로젝트에선 도로 그래프 유틸로 대체 권장
 */
function naiveConnectivityBonus(state, ai, edge) {
    const myRoads = ai.roads || [];
    const touched = new Set();
    myRoads.forEach((r) => {
        touched.add(r.a);
        touched.add(r.b);
    });
    return (touched.has(edge.a) || touched.has(edge.b)) ? 3 : 0;
}

/* ---------------------------- 전략 합성기 ---------------------------- */
/**
 * 여러 전략을 합성합니다.
 * - scoreAction: 모든 전략의 가중치를 '합산'
 * - chooseRobberTarget: 순차 변환(앞 전략 → 뒤 전략)
 * - preRollAdjustments: 각 전략의 프리훅 실행
 */
export function composeStrategies(...strategies) {
	return {
		scoreAction(state, ai, action, helpers) {
			return strategies.reduce(
				(acc, s) => acc + (s.scoreAction ? s.scoreAction(state, ai, action, helpers) : 0),
				0
			);
		},
		chooseRobberTarget(state, ai, basePick) {
			return strategies.reduce(
				(pick, s) => (s.chooseRobberTarget ? s.chooseRobberTarget(state, ai, pick) : pick),
				basePick
			);
		},
		preRollAdjustments(state, ai) {
			strategies.forEach((s) => s.preRollAdjustments?.(state, ai));
		},
	};
}

/* ------------------------------ 전략들 ------------------------------ */

/**
 * 1) Balanced — 균형형
 * - 모든 기본 액션에 적당한 보너스를 줌
 */
export const Balanced = {
  	scoreAction(state, ai, action) {
		switch (action.type) {
			case "UPGRADE_CITY":     return 6;
			case "BUILD_SETTLEMENT": return 8;
			case "BUILD_ROAD":       return 2;
			case "BUY_DEV_CARD":     return 3;
			default:                 return 0;
		}
  	},
};

/**
 * 2) RoadFirst — 도로 우선
 * - 네트워크 확장/최장도로를 노리는 성향
 * - 기존 네트워크에 붙는 도로면 추가 보너스
 */
export const RoadFirst = {
	scoreAction(state, ai, action) {
		if (action.type !== "BUILD_ROAD") return 0;
		let score = 8;
		score += naiveConnectivityBonus(state, ai, action.edge); // 연결되면 +3
		return score;
	},
};

/**
 * 3) DiversityFocus — 자원 다양성 확보
 * - 정착지 후보의 자원 다양성이 높을수록 점수 가산
 */
export const DiversityFocus = {
	scoreAction(state, ai, action, helpers) {
		if (action.type !== "BUILD_SETTLEMENT") return 0;
		const tilesById = Object.fromEntries(state.board.tiles.map((t) => [t.id, t]));
		const spotScore = helpers.scoreSettlementSpot(action.spot, tilesById);
		const diversityBoost = Math.min(helpers.resourceStats(ai).diversity, 5);
		return 0.5 * spotScore + diversityBoost; // 기본 가중 + 다양성 보너스
	},
};

/**
 * 4) CityRush — 도시 러시
 * - 고가치 정착지를 빠르게 도시로 전환
 */
export const CityRush = {
	scoreAction(state, ai, action, helpers) {
		if (action.type !== "UPGRADE_CITY") return 0;
		const tilesById = Object.fromEntries(state.board.tiles.map((t) => [t.id, t]));
		const b = (ai.buildings || []).find((x) => x.location === action.location);
		if (!b) return 0;
		const value = helpers.scoreCityUpgrade(b, tilesById);
		return 10 + 1.5 * value; // 기본 10 + 기대치 가중
	},
};

/**
 * 5) DevCardFocus — 개발카드 선호
 * - 밀/양/철 잉여가 많을수록 점수 추가
 */
export const DevCardFocus = {
	scoreAction(state, ai, action) {
		if (action.type !== "BUY_DEV_CARD") return 0;
		const { resources = {} } = ai;
		const surplus = (resources["밀"] || 0) + (resources["양"] || 0) + (resources["철"] || 0);
		return 7 + Math.floor(surplus / 2); // 기본 7 + 잉여/2
	},
};

/**
 * 6) Expansionist — 확장가
 * - 숫자 기대치가 좋은 정착지 확장에 높은 가중치
 */
export const Expansionist = {
	scoreAction(state, ai, action, helpers) {
		if (action.type !== "BUILD_SETTLEMENT") return 0;
		const tilesById = Object.fromEntries(state.board.tiles.map((t) => [t.id, t]));
		const value = helpers.scoreSettlementSpot(action.spot, tilesById);
		return 10 + value; // 기본 10 + 입지 가치
	},
};

/**
 * 7) FixWoodBrick — 나무/벽돌 부족 보완
 * - 도로/정착 핵심 자원이 부족하면 해당 액션에 페널티
 */
export const FixWoodBrick = {
	scoreAction(state, ai, action) {
		const wood  = countOf(ai.resources, "나무");
		// '벽돌' 오타 입력을 보강: '벡돌' 키도 체크
		const brick = countOf(ai.resources, "벽돌") || countOf(ai.resources, "벡돌");
		const penalty = (wood < 1 ? 2 : 0) + (brick < 1 ? 2 : 0);

		if (action.type === "BUILD_ROAD" || action.type === "BUILD_SETTLEMENT") {
		return -penalty; // 자원 부족일수록 점수 하향
		}
		return 0;
	},
};

/**
 * 8) HotNumbers — 6/8 포커스
 * - 6 또는 8 인접 정착지 스팟을 과감히 선호
 */
export const HotNumbers = {
	scoreAction(state, ai, action) {
		if (action.type !== "BUILD_SETTLEMENT") return 0;
			const tilesById = Object.fromEntries(state.board.tiles.map((t) => [t.id, t]));
			const has6or8 = (action.spot.adjacentTiles || []).some((tid) => {
			const t = tilesById[tid];
			return t && (t.number === 6 || t.number === 8);
		});
		return has6or8 ? 6 : 0;
	},
};

/**
 * 9) BlockadeRobber — 독점형 도둑
 * - 6/8 타일을 더 선호하고, 피해자 중 카드가 가장 많은 상대를 노림
 * - basePick(기본 선택)을 받아 필요시 교체
 */
export const BlockadeRobber = {
	chooseRobberTarget(state, ai, basePick) {
		const { tiles } = state.board;
		const tile = tiles.find((t) => t.id === basePick.targetTileId);
		if (!tile) return basePick;

		// 6/8이 아닌 경우는 건드리지 않음(기본 선택 유지)
		const isHot = tile.number === 6 || tile.number === 8;
		if (!isHot) return basePick;

		// 같은 타일 내에서 '카드 가장 많은' 피해자 선택으로 교체
		const victims = state.players.filter(
		(p) =>
			p.id !== ai.id &&
			(p.buildings || []).some((b) => (b.adjacentTiles || []).includes(tile.id))
		);
		if (victims.length === 0) return basePick; //길이 체크

		const swap = victims
		.map((v) => ({ v, cards: totalCards(v.resources) }))
		.sort((a, b) => b.cards - a.cards)[0];

		if (swap && (!basePick.victimId || swap.v.id !== basePick.victimId)) {
			return { targetTileId: tile.id, victimId: swap.v.id };
		}
		return basePick;
	},
};

/* ---------------------------- 헬퍼 팩토리 ---------------------------- */
/**
 * aiDecisionMaker.js에서 전달할 helpers 팩토리 예시
 * - 이 모듈은 상태 의존을 줄이고, 평가 함수/가중치/비용 계산 유틸을 주입받아 동작
 */
export function makeStrategyHelpers({
		NUM_WEIGHT,
		scoreSettlementSpot,
		scoreCityUpgrade,
		hasCost,
		tryBankTrades,
		missingFor,
	}) {
	return {
			NUM_WEIGHT,
			scoreSettlementSpot,
			scoreCityUpgrade,
			hasCost,
			tryBankTrades,
			missingFor,
			resourceStats(ai) {
			return {
				diversity: resourceDiversity(ai.resources),
				counts: { ...(ai.resources || {} ) },
			};
		},
	};
}
