// 카탄 게임의 전체 흐름(턴 관리(건설, 자원 분배, 자원 거래, ), 행동 가능 여부 등)을 제어하는 핵심 엔진입니다.

import { create } from "zustand";
import { persist } from "zustand/middleware";

//현재 시각을 로그용 문자열로 반환
const now = () => new Date().toLocaleTimeString();

//플레이어가 가진 모든 자원 카드 총합 ex) {나무 : 2, 벽돌 : 1} -> 3
const sumResources = (p) => Object.values(p.resources || {}).reduce((a, b) => a + (b || 0) , 0);

//자원 obj[key]에 n만큼 증감(음수면 감소)
const addRes = (obj, key, n) => {
  obj[key] = (obj[key] || 0) + n;
};

//cost({자원:수량})만큼 자원을 차감
const spend = (obj, cost) => {
  Object.entries(cost).forEach(([k, v]) => {
    obj[k] = (obj[k] || 0) - (v || 0);
  });
};

//현재 보유 자원이 cost를 모두 충족하는지 검사
const hasCost = (obj, cost) => Object.entries(cost).every(([k, v]) => (obj[k] || 0) >= (v || 0));

//플레이어 자원을 무작위로 count장 폐기 => 7이 나왔을 때 8장 이상인 플레이어가 절반을 버릴 때
const randomDiscard = (player, count) => {
    //자원을 카드로 풀로 평탄화

    const pool = Object.entries(player.resources || {}).flatMap(([r, q]) =>
        Array(q || 0).fill(r)
    );

    //Fisher-Yates 셔플
    for(let i = pool.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const toDiscard = pool.slice(0, count);
    const cloned = {...player, resources : {...(player.resources || {}) } };
    toDiscard.forEach((r) => addRes(cloned.resources, r, -1));
    return cloned;
};

//도둑이 피해자에게서 자원 1장을 랜덤으로 훔침
//피해자에게 자원이 없다면 변화 없음
//반환 : victim, thief, stolen
const randomRob = (victim, thief) => {
    const pool = Object.entries(victim.resources || {}).flatMap(([r, q]) =>
        Array(q || 0).fill(r)
    );

    if(pool.length === 0) return {victim, thief, stolen : null};

    const stolen = pool[Math.floor(Math.random) * pool.length];

    const v2 = {...victim, resources : {...(victim.resources || {}) } };
    const t2 = {...thief, resources : {...(thief.resources || {}) } };

    addRes(v2.resources, stolen, -1);
    addRes(t2.resources, stolen, +1);

    return {victim : v2, thief: t2, stolen};

};

//도로, 그래프 관련 유틸
const edgeId = (a, b) => [a, b].sort().join("-");

//보드 엣지 배열을 바탕으로
const buildVertexToEdges = (edges) => {
    const map = {};
    edges.forEach((e) => {
        if(!map[e.a]) map[e.a] = [];
        if(!map[e.b]) map[e.b] = [];

        map[e.a].push(e.id);
        map[e.b].push(e.id);
    });

    return map;
}

//특정 교차점 v에 "상대" 건물이 있으면 true - 카탄 규칙 : 상대 건물이 있는 교차점은 도로가 "관통"할 수 없음(끊김)
const isBlockedVertex = (ownerId, players, v) => {
    for(const p of players) {
        if(p.id !== ownerId && (p.buildings || []).some((b) => b.location === v)) {
            return true;
        }
    }
    return false;
}

//플레이어가 교차점 v에 자신의 건물을 갖고 있는지
const playerHasBuildingAt = (player, v) => (player.buildings || []).some((b) => b.location === v);

//최장 도로 계산
/*
    자신의 도로만 따라갈 수 있음
    같은 간선(도로)을 두 번 사용할 수 있음
    상대 건물이 있는 교차점은 '통과' 불가(끝점으로 끝나는건 허용)
*/

const calcLongestRoadLength = (owner, players, board) => {
    if(!board.edges?.length) return 0;

    //내가 소유한 도로 id만 모아서 빠르게 조회하기 위한 Set
    const ownerEdges = new Set((owner.roads || []).map((r) => r.id));

    //vertex -> [edgeId] 캐시(없으면 생성)
    const v2e = board.vertexToEdges || buildVertexToEdges(board.edges);
    
    let best = 0;

    const visited = new Set(); //사용한 간선 재사용 방지
    const dfs = (vertex, length, prevVertex) => {
        best = Math.max(best, length);
        const adj = v2e[vertex] || [];

        for(const eid of adj) {
            if(visited.has(eid)) continue; //간선 재사용 금지
            if(!ownerEdges.has(eid)) continue;  //내 도로가 아니면 제외
            const e = board.edges.find((x) => x.id === eid);
            if(!e) continue;

            const nextV = e.a === vertex ? e.b : e.a;

            //상대 건물이 있는 교차점은 통과 불가
            
        }
    }


}







