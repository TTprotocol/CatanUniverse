/**
 * 플레이어의 행동(건설, 도둑 이동, 교환 등)을 처리하는 순수 함수/훅 모음
 * - 외부 상태(players 등)는 모두 인자로 주입 → 테스트/재사용 용이
 * - adjacentTiles 명칭으로 통일
 */

// 0) 공용 유틸

// 플레이어가 보유한 전체 자원 카드 개수
const countResources = (player) =>
	Object.values(player.resources || {}).reduce((a, b) => a + (b || 0), 0);

// 플레이어로부터 자원 카드 n장을 무작위로 버리게 함
const discardResourcesRandomly = (player, n) => {
	const pool = Object.entries(player.resources || {}).flatMap(([r, q]) =>
		Array(q || 0).fill(r)
	);
	// 셔플
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	const toDiscard = pool.slice(0, n);
	const p2 = { ...player, resources: { ...(player.resources || {}) } };
	toDiscard.forEach((r) => (p2.resources[r] = (p2.resources[r] || 0) - 1));
	return p2;
};

//플레이어가 랜덤하게 카드를 한 장 가져오기
const robOneResource = (victim, thief) => {
	const pool = Object.entries(victim.resources || {}).flatMap(([r, q]) =>
		Array(q || 0).fill(r)
	);

	if (pool.length === 0)
		return { updatedFrom: victim, updatedTo: thief, stolen: null };
	const stolen = pool[Math.floor(Math.random() * pool.length)];
	const v2 = { ...victim, resources: { ...(victim.resources || {}) } };
	const t2 = { ...thief, resources: { ...(thief.resources || {}) } };
	v2.resources[stolen] -= 1;
	t2.resources[stolen] = (t2.resources[stolen] || 0) + 1;
	return { updatedFrom: v2, updatedTo: t2, stolen };
};

/*
 * 1) 플레이어 건설
 *   - 정착지 건설(buildSettlement)
 *   - 도시 업그레이드(upgradeToCity)
 * props
 *   - players: 플레이어 배열
 *   - setPlayers: players 상태 갱신 함수
 */

export const useBuildActions = ({ players, setPlayers }) => {
	//정착지(마을) 건설
	const buildSettlement = (playerId, location, adjacentTiles) => {
		// 정착지 비용(카탄 규칙): 나무1, 벽돌1, 밀1, 양1
		const cost = { 나무: 1, 벽돌: 1, 밀: 1, 양: 1 };

		// 대상 플레이어
		const player = players.find((p) => p.id === playerId);
		if (!player) throw new Error("플레이어를 찾을 수 없습니다.");

		// 위치 중복 금지
		if (player.buildings.some((b) => b.location === location)) {
			throw new Error("이미 건물이 있는 위치입니다.");
		}

		// 비용 보유 확인
		const ok = Object.entries(cost).every(
			([type, amt]) => (player.resources[type] || 0) >= amt
		);

		if (!ok) throw new Error("자원이 부족합니다.");

		// 새 건물
		const newBuilding = { type: "settlement", location, adjacentTiles };

		// 비용 차감 + 건물 추가
		const updatedPlayer = {
			...player,
			resources: Object.fromEntries(
				Object.entries(player.resources).map(([type, val]) => [
					type,
					val - (cost[type] || 0),
				])
			),
			buildings: [...player.buildings, newBuilding],
		};

		setPlayers(players.map((p) => (p.id === playerId ? updatedPlayer : p)));
	};

	// 도시 업그레이드(정착지 → 도시)
	const upgradeToCity = (playerId, location) => {
		// 비용: 밀2, 철3
		const cost = { 밀: 2, 철: 3 };

		const player = players.find((p) => p.id === playerId);
		if (!player) throw new Error("플레이어를 찾을 수 없습니다.");

		// 해당 위치에 '정착지'가 있어야 함
		const idx = player.buildings.findIndex(
			(b) => b.location === location && b.type === "settlement"
		);
		if (idx === -1) throw new Error("정착지가 없습니다.");

		const ok = Object.entries(cost).every(
			([type, amt]) => (player.resources[type] || 0) >= amt
		);
		if (!ok) throw new Error("자원이 부족합니다.");

		// 건물 타입 변경
		const updatedBuildings = [...player.buildings];
		updatedBuildings[idx].type = "city";

		// 비용 차감
		const updatedPlayer = {
			...player,
			resources: Object.fromEntries(
				Object.entries(player.resources).map(([type, val]) => [
					type,
					val - (cost[type] || 0),
				])
			),
			buildings: updatedBuildings,
		};

		setPlayers(players.map((p) => (p.id === playerId ? updatedPlayer : p)));
	};

	return { buildSettlement, upgradeToCity };
};

/*
 * 2) 도둑 관련 로직(주사위 합 7일 때)
 *   - 자원 8장 이상 보유자: 절반 버리기
 *   - 도둑 이동
 *   - 도둑 인접 플레이어에게서 자원 1장 강탈
 *
 * rollDiceSevenHandler는 외부 의존성을 모두 인자로 받도록 구성:
 *   - players, setPlayers         : 상태
 *   - currentPlayer               : 현재 턴 플레이어 객체
 *   - newTileId                   : 도둑이 이동할 타일 id (UI 선택 결과)
 *   - setRobberTile               : 보드의 도둑 위치 갱신 함수(id 저장)
 *   - chooseVictimFn (선택)       	: 피해자 선택 함수(없으면 첫 번째 대상)
 */

export const rollDiceSevenHandler = ({
	players,
	setPlayers,
	currentPlayer,
	newTileId,
	setRobberTile,
	chooseVictimFn, // (victims) => victimId 또는 victim 객체
}) => {
	// 1) 8장 이상 → 절반 버리기
	const afterDiscard = players.map((p) => {
		const total = countResources(p);
		if (total > 7) {
			const toDiscard = Math.floor(total / 2);
			return discardResourcesRandomly(p, toDiscard);
		}
		return p;
	});
	setPlayers(afterDiscard);

	// 2) 도둑 이동
	setRobberTile(newTileId);

	// 3) 강탈 대상: 도둑이 위치한 타일과 인접한 건물을 가진 "다른" 플레이어
	const victims = afterDiscard.filter(
		(p) =>
			p.id !== currentPlayer.id &&
			(p.buildings || []).some((b) =>
				(b.adjacentTiles || []).includes(newTileId)
			)
	);

	if (victims.length === 0) return; // 강탈 대상 없음

	// UI에서 고르게 하거나, 기본으로 첫 번째 피해자 선택
	const victimChosen =
		(typeof chooseVictimFn === "function" && chooseVictimFn(victims)) ||
		victims[0];
	const { updatedFrom, updatedTo } = robOneResource(
		victimChosen,
		currentPlayer
	);

	// 피해자/가해자만 교체해서 players 갱신
	const final = afterDiscard.map((p) => {
		if (p.id === updatedFrom.id) return updatedFrom;
		if (p.id === updatedTo.id) return updatedTo;
		return p;
	});

	setPlayers(final);
};

/*
 * 2-1) 자원 분배 (도둑 차단 포함)
 *   - dice: 이번 턴 주사위 합
 *   - tiles: 보드 타일 배열 [{id, number, resource}, ...]
 *   - robberTileId: 도둑이 있는 타일 id
 *   - 규칙:
 *     * 사막은 생산 없음
 *     * 도둑이 있는 타일은 생산 차단
 *     * 정착지=1, 도시=2
 */

export const distributeResourcesByDicePure = ({
	players,
	setPlayers,
	dice,
	tiles,
	robberTileId,
}) => {
	if (!dice || dice === 7) return; // 7은 도둑 이벤트에서 처리
	if (!Array.isArray(players) || players.length === 0) return;
	if (!Array.isArray(tiles) || tiles.length === 0) return;

	const matchedTiles = tiles.filter((t) => t.number === dice);
	if (matchedTiles.length === 0) return;

	const updatedPlayers = players.map((player) => {
		const newRes = { ...(player.resources || {}) };

		(player.buildings || []).forEach((b) => {
			(b.adjacentTiles || []).forEach((tileId) => {
				const tile = matchedTiles.find((t) => t.id === tileId);
				if (!tile) return;
				if (tile.id === robberTileId) return; // 도둑 차단
				if (tile.resource === "사막") return; // 사막은 생산 없음

				const amount = b.type === "city" ? 2 : 1;
				newRes[tile.resource] = (newRes[tile.resource] || 0) + amount;
			});
		});

		return { ...player, resources: newRes };
	});

	setPlayers(updatedPlayers);
};

/*
 * 3) 자원 교환
 *   3-1) 플레이어 간 교환
 *   3-2) 은행/항구 교환
 */

/**
 * 3-1. 플레이어 간 자원 교환
 * @param {Player} fromPlayer  - 자원을 내는 플레이어
 * @param {Player} toPlayer    - 자원을 받는 플레이어
 * @param {Object} offer       - fromPlayer가 내놓는 자원 {자원:수량}
 * @param {Object} request     - toPlayer가 내놓는 자원 {자원:수량}
 * @returns {[Player, Player]} - 갱신된 두 플레이어
 */

export const tradeBetweenPlayers = (fromPlayer, toPlayer, offer, request) => {
	// 보유 확인
	for (const [type, amount] of Object.entries(offer || {})) {
		if ((fromPlayer.resources[type] || 0) < amount) {
			throw new Error(`${fromPlayer.name}의 ${type} 자원이 부족합니다.`);
		}
	}

	for (const [type, amount] of Object.entries(request || {})) {
		if ((toPlayer.resources[type] || 0) < amount) {
			throw new Error(`${toPlayer.name}의 ${type} 자원이 부족합니다.`);
		}
	}

	// 교환 적용
	const newFrom = { ...fromPlayer.resources };
	const newTo = { ...toPlayer.resources };

	for (const [type, amount] of Object.entries(offer || {})) {
		newFrom[type] -= amount;
		newTo[type] = (newTo[type] || 0) + amount;
	}
	for (const [type, amount] of Object.entries(request || {})) {
		newTo[type] -= amount;
		newFrom[type] = (newFrom[type] || 0) + amount;
	}

	return [
		{ ...fromPlayer, resources: newFrom },
		{ ...toPlayer, resources: newTo },
	];
};

/**
 * 3-2. 은행/항구 교환
 * @param {Player} player
 * @param {string} giveType    - 내놓을 자원
 * @param {string} receiveType - 받을 자원
 * @returns {Player}           - 갱신된 플레이어
 *
 * 포트 모델 가정:
 *   player.ports = ['나무', 'any'] // '나무' 2:1, any 3:1
 *   없으면 기본 4:1
 */
export const tradeWithBank = (player, giveType, receiveType) => {
	let rate = 4;
	if (player.ports?.includes(giveType)) rate = 2;
	else if (player.ports?.includes("any")) rate = 3;

	if ((player.resources[giveType] || 0) < rate) {
		throw new Error(
			`${giveType} 자원이 ${rate}개 이상 있어야 교환이 가능합니다.`
		);
	}

	return {
		...player,
		resources: {
			...player.resources,
			[giveType]: player.resources[giveType] - rate,
			[receiveType]: (player.resources[receiveType] || 0) + 1,
		},
	};
};
