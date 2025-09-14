// AI가 현재 턴에 어떤 행동을 할지를 결정하는 메인 로직입니다.

/*
    컴퓨터 vs 나 모드 : AI가 자기 턴에 연속적으로 최선의 행동을 고르고 수행하는 메인 로직
    - 단계 : ROLL -> 7이면 도둑 -> ACTION(여러번) -> END
    - 안전장치 : 최대 n회 행동, 최소 점수 미달 시 종료
*/


import useGameStore from '../state/gameStore';

//기본 유틸

const NUM_WEIGHT = {2:1, 3:2, 4:3, 5:4, 6:5, 8:5, 9:4, 10:3, 11:2, 12:1};
const COSTS = {
    road : {나무:1, 벽돌:1},
    settle: {나무:1, 벽돌:1, 말:1, 양:1},
    city: {밀:2, 철:3},
    dev: {밀:1, 양:1, 철:1},
};

const hasCost = (res={}, cost={}) => Object.entries(cost).every(([k, v]) => (res[k] || 0) >= v);
const missingFor = (res={}, cost={}) => {
    const need = {};
    Object.entries(cost).forEach(([k, v]) => {
        const lack = v - (res[k] || 0);
        if(lack > 0) need[k] = lack;
    });

    return need;
} 

const totalCards = (res={}) => Object.values(res).reduce((a, b) => a + (b || 0), 0);

//보드 접근 
//ai가 설치가능한 정착지 스팟 함수

function findAiSpots(state, aiPlayer) {
    return state.board?.ai?.getSettlementSpots?.(aiPlayer) || [];
}

function findAiRoad(state, aiPlayer) {
    return state.board?.ai?.getRoadEdges?.(aiPlayer) || [];
}

function pickBestRobberMove(state, aiPlayer) {
    const {tiles, robber} = state.board;
    const tilesById = Object.fromEntries(tiles.map(t=>[t.id, t]));
    let best = null;

    for(const t of tiles) {
        if(!t.number || t.resource === '사막' || t.id === robber) continue;
        const victims = state.players.filter(p => 
            p.id !== aiPlayer.id && 
            (p.buildings || []).some(b => (b.adjacentTiles || []).includes(t.id))
        );
        if(victims.length === 0) continue;

        const victim = victims
        .map(v => ({v, cards: totalCards(v.resource)}))
        .sort((a,b) => b.cards - a.cards)[0];

        const score = (NUM_WEIGHT[t.number] || 0)*2 + (victim?.cards || 0);
        if(!best || score > best.score) best = {score, targetTileId : t.id, victimId: victim}
    }

    return best || {targetTileId : robber, victimId : null};
}





