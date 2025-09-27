// aiAgent.js
// ======================================================================
// 카탄: "컴퓨터 vs 나" 모드 — AI 턴 의사결정 메인 엔진 (React + JS)
// ----------------------------------------------------------------------
// 턴 흐름(스토어 phase 기준):
//   1) ROLL   : 주사위 굴림 (7이면 ROBBER로 전환되어야 함)
//   2) ROBBER : 도둑 이동 + 카드 1장 강탈
//   3) ACTION : 여러 행동을 연속 수행(최대 maxSteps) → 종료 조건 시 END_TURN
//
// 본 파일은 "의사결정 로직"만 포함. 실제 상태 변경은 Zustand store 메서드에 위임.
//  - 필요한 store 메서드(옵셔널 체이닝 사용):
//    rollDice(), moveRobber(tileId, victimId?), buildSettlement(id, location, adjacentTiles[]),
//    buildRoad(id, nodeA, nodeB), upgradeToCity(id, location), buyDevCard(id), tradeWithBank(id, give, get),
//    endTurn()
//
// 프로젝트 연결 포인트 (유틸):
//  - state.board.ai.getSettlementSpots(aiPlayer) : 정착지 후보 계산(거리 2 규칙/점유/도로 연결 등)
//  - state.board.ai.getRoadEdges(aiPlayer)       : 도로 후보 계산(내 네트워크에서 이어지는 미점유 간선 등)
//  - building.adjacentTiles[]                    : 건물과 인접한 타일 id 배열
// ======================================================================

import useGameStore from "../state/gameStore";

/* ----------------------------------------------------------------------
 * 0) 상수/유틸
 * -------------------------------------------------------------------- */

//숫자 토큰 기대 빈도 가중치(간단 근사치)
//6/8 : 5, 5/9 : 4, 4/10 : 3, 3/11 : 2, 2/12 : 1

const NUM_WEIGHT = { 2:1, 3:2, 4:3, 5:4, 6:5, 8:5, 9:4, 10:3, 11:2, 12:1 };

//표준 비용(카탄 기본 규칙)

const COSTS = {
  road:   { 나무: 1, 벽돌: 1 },
  settle: { 나무: 1, 벽돌: 1, 밀: 1, 양: 1 },
  city:   { 밀: 2, 철: 3 },
  dev:    { 밀: 1, 양: 1, 철: 1 },
};

// 주어진 자원(res)으로 해당 비용(cost) 즉시 지불 가능 여부
const hasCost = (res = {}, cost = {}) =>
  Object.entries(cost).every(([k, v]) => (res[k] || 0) >= v);

// 비용 대비 부족한 자원 유형/수량 계산 (예: {밀:1, 벽돌:1})
const missingFor = (res = {}, cost = {}) => {
  const need = {};
  for (const [k, v] of Object.entries(cost)) {
    const lack = v - (res[k] || 0);
    if (lack > 0) need[k] = lack;
  }
  return need;
};

// 플레이어 보유 전체 카드 수(강탈 대상 우선순위 판단에 사용)
const totalCards = (res = {}) => Object.values(res).reduce((sum, n) => sum + (n || 0), 0);

/* ----------------------------------------------------------------------
 * 1) 보드 접근: 프로젝트 연결 포인트 (필요 시 여기만 갈아끼우면 됨)
 * -------------------------------------------------------------------- */

//AI가 건설 가능한 정착지 후보 목록 반환
//- 거리 규칙(두 칸 거리), 점유 여부, 도로 연결성 등은 유틸 내부에서 검증
function getSettlementSpots(state, aiPlayer) {
  return state.board?.ai?.getSettlementSpots?.(aiPlayer) || [];
}

//AI가 건설 가능한 도로 후보 목록 반환
//- 내 기존 네트워크에서 확장 가능한 미점유 간선 등
function getRoadEdges(state, aiPlayer) {
  return state.board?.ai?.getRoadEdges?.(aiPlayer) || [];
}

/* ----------------------------------------------------------------------
 * 2) 도둑 이동/강탈 후보 선택
 *   - 기대 생산량 높은 타일 + 카드 많이 가진 상대를 우선
 * -------------------------------------------------------------------- */
function pickBestRobberMove(state, aiPlayer) {
  const { tiles, robber } = state.board;
  let best = null;

  for (const t of tiles) {
    // 숫자 없음 / 사막 / 현재 위치 → 스킵
    if (!t.number || t.resource === "사막" || t.id === robber) continue;

    // 이 타일에 인접한 "상대"만 피해자 후보
    const victims = state.players.filter(
      (p) =>
        p.id !== aiPlayer.id &&
        (p.buildings || []).some((b) => (b.adjacentTiles || []).includes(t.id))
    );
    if (victims.length === 0) continue;

    // 카드 장수가 가장 많은 상대를 대표 피해자로 선택
    const victim = victims
      .map((v) => ({ v, cards: totalCards(v.resources) }))
      .sort((a, b) => b.cards - a.cards)[0];

    // 타일 기대치 + 피해자 카드수 기반 점수
    const score = (NUM_WEIGHT[t.number] || 0) * 2 + (victim?.cards || 0);

    if (!best || score > best.score) {
      best = { score, targetTileId: t.id, victimId: victim.v.id };
    }
  }

  // 적합 후보 없으면 제자리(피해자 없음)
  return best || { targetTileId: robber, victimId: null };
}

/* ----------------------------------------------------------------------
 * 3) 입지 평가 (정착지/도시)
 * -------------------------------------------------------------------- */

// 정착지 후보 가치: (인접 숫자 기대치 합) + (자원 다양성 보너스 최대 +3)
function scoreSettlementSpot(spot, tilesById) {
  let s = 0;
  const types = new Set();

  for (const tid of spot.adjacentTiles || []) {
    const t = tilesById[tid];
    if (!t || !t.number || t.resource === "사막") continue;
    s += NUM_WEIGHT[t.number] || 0;
    types.add(t.resource);
  }

  return s + Math.min(types.size, 3);
}

// 도시 업그레이드 가치: 해당 정착지 인접 타일의 기대치 합
//  (도시는 정착지 대비 +1배 생산 → 기대치 합이 곧 추가 생산 기대치)
function scoreCityUpgrade(building, tilesById) {
  let s = 0;
  for (const tid of building.adjacentTiles || []) {
    const t = tilesById[tid];
    if (!t || !t.number || t.resource === "사막") continue;
    s += NUM_WEIGHT[t.number] || 0;
  }
  return s;
}

/* ----------------------------------------------------------------------
 * 4) 은행/항구 교환 시뮬(가상 계산)
 *   - 실제 교환 없이 "맞출 수 있는지"만 판단하기 위한 가상 자원 상태 생성
 * -------------------------------------------------------------------- */
function tryBankTrades(state, aiPlayer, targetCost) {
  // 자원별 교환 비율:
  //   해당 자원 전용 항구 보유 → 2:1
  //   일반 항구('any') 보유     → 3:1
  //   기본                        → 4:1
  const ratioFor = (resType) => {
    if (aiPlayer.ports?.includes(resType)) return 2;
    if (aiPlayer.ports?.includes("any")) return 3;
    return 4;
  };

  const need = missingFor(aiPlayer.resources, targetCost);
  const newRes = { ...(aiPlayer.resources || {}) };

  // 많이 가진 자원부터 부족 자원으로 전환 시도
  const sortedHave = Object.entries(newRes).sort(
    (a, b) => (b[1] || 0) - (a[1] || 0)
  );

  for (const [needType, lack] of Object.entries(need)) {
    let remain = lack;
    for (const [haveType] of sortedHave) {
      if (remain <= 0) break;
      if (haveType === needType) continue;

      const rate = ratioFor(haveType);
      while ((newRes[haveType] || 0) >= rate && remain > 0) {
        newRes[haveType] -= rate;                   // rate개 내고
        newRes[needType] = (newRes[needType] || 0) + 1; // 1개 받는다
        remain--;
      }
    }
  }

  return newRes; //실제 반영은 아님(스코어링 판단용), 실행단계에서 교환 호출
}

/* ----------------------------------------------------------------------
 * 5) 후보 액션 생성
 *   - 도시 업그레이드, 정착지, 도로, 개발 카드, 종료
 * -------------------------------------------------------------------- */
function enumerateActions(state, aiPlayer) {
  const actions = [];

  //도시 업그레이드: 내 정착지 목록에서만 선택
  (aiPlayer.buildings || [])
    .filter((b) => b.type === "settlement")
    .forEach((b) =>
      actions.push({ type: "UPGRADE_CITY", location: b.location })
    );

  //정착지: 보드 유틸에서 후보 받아오기
  const spots = getSettlementSpots(state, aiPlayer);
  spots.forEach((spot) =>
    actions.push({
      type: "BUILD_SETTLEMENT",
      location: spot.location,
      spot, // { location, adjacentTiles[] } 형태를 기대
    })
  );

  //도로: 보드 유틸에서 후보 받아오기
  const edges = getRoadEdges(state, aiPlayer);
  edges.forEach((edge) => actions.push({ type: "BUILD_ROAD", edge })); // edge: { a, b }

  //개발 카드 구매
  actions.push({ type: "BUY_DEV_CARD" });

  //종료(최후의 보루)
  actions.push({ type: "END_TURN" });

  return actions;
}

/* ----------------------------------------------------------------------
 * 6) 액션 점수화
 *   - 즉시 가능(can) > 교환으로 근접(near) > 입지 가치(value)
 *   - 가중치는 난이도·성향 튜닝 포인트
 * -------------------------------------------------------------------- */
function scoreAction(state, aiPlayer, action) {
  const tilesById = Object.fromEntries(
    state.board.tiles.map((t) => [t.id, t])
  );
  const res = aiPlayer.resources || {};

  switch (action.type) {
    case "UPGRADE_CITY": {
      const b = (aiPlayer.buildings || []).find(
        (x) => x.location === action.location
      );
      const value = b ? scoreCityUpgrade(b, tilesById) : 0;
      const can  = hasCost(res, COSTS.city);
      const near = hasCost(tryBankTrades(state, aiPlayer, COSTS.city), COSTS.city);
      return (can ? 100 : near ? 60 : 0) + value * 4;
    }

    case "BUILD_SETTLEMENT": {
      const value = scoreSettlementSpot(action.spot, tilesById);
      const can  = hasCost(res, COSTS.settle);
      const near = hasCost(tryBankTrades(state, aiPlayer, COSTS.settle), COSTS.settle);
      return (can ? 80 : near ? 45 : 0) + value * 5;
    }

    case "BUILD_ROAD": {
      // 도로는 기본 가치 낮게(확장성/최장도로 평가 붙이면 조정)
      const can  = hasCost(res, COSTS.road);
      const near = hasCost(tryBankTrades(state, aiPlayer, COSTS.road), COSTS.road);
      return (can ? 25 : near ? 10 : 0);
    }

    case "BUY_DEV_CARD": {
      const can  = hasCost(res, COSTS.dev);
      const near = hasCost(tryBankTrades(state, aiPlayer, COSTS.dev), COSTS.dev);
      // 기사/풍요/독점/도로건설/승점의 평균 기대치 → 중간값 부여
      return (can ? 35 : near ? 15 : 0);
    }

    case "END_TURN":
      return 1;

    default:
      return 0;
  }
}

/* ----------------------------------------------------------------------
 * 7) 액션 실행 (Zustand store 메서드 호출)
 *   - 부족 자원은 은행/항구 교환으로 메꾼 뒤 시도
 *   - 실제 교환은 store.tradeWithBank(id, give, get)에 위임(있을 때만)
 * -------------------------------------------------------------------- */
function executeAction(state, aiPlayer, action) {
  const S = useGameStore.getState();

  // 🚰 부족 자원을 은행/항구 교환으로 채우는 보조 함수
  const fillByBank = (cost) => {
    const need = missingFor(aiPlayer.resources, cost);

    // 필요 수량만큼 반복 교환 시도
    for (const [needType, lack] of Object.entries(need)) {
      for (let i = 0; i < lack; i++) {
        // "가장 많이 보유한" 자원부터 소진 (needType 제외)
        const haveType = Object.entries(aiPlayer.resources)
          .sort((a, b) => (b[1] || 0) - (a[1] || 0))
          .find(([k, v]) => k !== needType && v > 0)?.[0];

        if (!haveType) break;
        S.tradeWithBank?.(aiPlayer.id, haveType, needType);
      }
    }
  };

  switch (action.type) {
    case "UPGRADE_CITY":
      if (!hasCost(aiPlayer.resources, COSTS.city)) fillByBank(COSTS.city);
      S.upgradeToCity?.(aiPlayer.id, action.location);
      break;

    case "BUILD_SETTLEMENT":
      if (!hasCost(aiPlayer.resources, COSTS.settle)) fillByBank(COSTS.settle);
      S.buildSettlement?.(
        aiPlayer.id,
        action.location,
        action.spot?.adjacentTiles || []
      );
      break;

    case "BUILD_ROAD":
      if (!hasCost(aiPlayer.resources, COSTS.road)) fillByBank(COSTS.road);
      // edge: { a, b } (노드ID) 형태라고 가정 — 프로젝트 유틸에 맞춰 조정
      S.buildRoad?.(aiPlayer.id, action.edge.a, action.edge.b);
      break;

    case "BUY_DEV_CARD":
      if (!hasCost(aiPlayer.resources, COSTS.dev)) fillByBank(COSTS.dev);
      S.buyDevCard?.(aiPlayer.id);
      break;

    case "END_TURN":
      S.endTurn?.(); // 다음 플레이어에게 턴 양도 + phase 초기화(ROLL) 등은 store에서 처리
      break;

    default:
      // 정의되지 않은 액션은 무시
      break;
  }
}

/* ----------------------------------------------------------------------
 * 8) ROBBER 단계: 도둑 이동 + 피해자 강탈 실행
 *   - moveRobber가 내부에서 robber 위치 갱신 + 강탈 1장 수행하도록 구현 필요
 * -------------------------------------------------------------------- */
export function aiRobberPhase() {
  const S  = useGameStore.getState();
  const me = S.players[S.currentPlayerIndex];

  const { targetTileId, victimId } = pickBestRobberMove(S, me);
  S.moveRobber?.(targetTileId, victimId || undefined);
}

/* ----------------------------------------------------------------------
 * 9) 메인 루프: AI가 현재 턴을 수행
 *   - 여러 액션을 연속 수행(maxSteps)
 *   - 최소 점수 미만이거나 END_TURN이면 종료
 *   - phase 전환(ROLL→ROBBER→ACTION)은 store 쪽에서 관리한다고 가정
 * -------------------------------------------------------------------- */
/**
 * AI가 자신의 턴을 수행합니다.
 * @param {number} [maxSteps=4]  한 턴에 허용할 최대 행동 횟수(무한 루프 방지)
 * @param {number} [minScore=10] 최소 점수 미만의 액션은 실행하지 않음
 */
export function aiTurn(maxSteps = 4, minScore = 10) {
  const S = useGameStore.getState();

  // 1) 주사위 단계
  if (S.phase === "ROLL") {
    // rollDice 내부에서: 7이면 자동으로 phase를 ROBBER로 전환되도록 구현 권장
    S.rollDice?.();
    return; // 이번 프레임 종료(다음 프레임에 ROBBER 또는 ACTION으로 이어짐)
  }

  // 2) 도둑 단계
  if (S.phase === "ROBBER") {
    aiRobberPhase();
    return;
  }

  // 3) 액션 단계
  if (S.phase === "ACTION") {
    let steps = 0;

    while (steps < maxSteps) {
      // 매 수행 시 최신 상태 스냅샷 취득(이전 액션으로 변경됐을 수 있음)
      const state = useGameStore.getState();
      const me    = state.players[state.currentPlayerIndex];

      // 후보 생성 → 스코어링 → 최고점 선택
      const ranked = enumerateActions(state, me)
        .map((a) => ({ a, score: scoreAction(state, me, a) }))
        .sort((x, y) => y.score - x.score);

      const best = ranked[0];

      // 의미 있는 액션이 없거나, 종료 선택이면 턴 종료
      if (!best || best.score < minScore || best.a.type === "END_TURN") {
        S.endTurn?.();
        return;
      }

      // 최고점 액션 실행
      executeAction(state, me, best.a);
      steps += 1;

      // 실행 결과로 phase 변화/승리 발생 시 루프 종료(다음 프레임에서 이어감)
      const now = useGameStore.getState();
      if (now.phase !== "ACTION" || now.winner) return;
    }

    // 안전장치: 스텝 한도 도달 시 턴 종료
    S.endTurn?.();
  }
}
