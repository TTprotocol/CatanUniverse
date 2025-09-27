// AI의 전략 평가 함수들을 정의한 모듈입니다. (예: 도로 우선, 자원 확보 등)
/*
- 이 모듈은 AI의 성향을 정의
- 각 전략은 scoreAction / chooseRobberTarget / preRollAdjustments 중 필요한 것만 구현
- composeStrategies로 여러 전략을 합성해 사용
- 액션 포맷 예시 : 
    - {type : 'BUILD_SETTLEMENT', location, spot}
    - {type : 'BUILD_ROAD', edge}
    - {type : 'UPGRADE_CITY', location}
    - {type : 'BUY_DEV_CARD'}
    - {type : 'END_TURN'}

    // helpers 인자 (aiAgent에서 전달):
    // - NUM_WEIGHT: 숫자 타일 기대치 가중치 맵 (예: {6:5, 8:5, ...})
    // - scoreSettlementSpot(spot, tilesById), scoreCityUpgrade(building, tilesById)
    // - resourceStats(ai): { diversity, counts }
    // - hasCost(ai.resources, COSTS.*), tryBankTrades(...), missingFor(...)


*/

//-공통 유틸
//자원 다양성 점수(종류 수)
function resourceDiversity(resources = {}) {
    return Object.keys(resources).filter((k) => (resources[k] || 0) > 0).length;
}

//특정 자원 수
function countOf(resources = {}, type) {
    return resources?.[type] || 0;
}

//두 점 사이(정점 기준)와의 연결 / 확장 여부를 평가하기 위한 간단 점수(옵션)
//프로젝트에선 도로 그래프 유틸을 통해 대체 가능

function naiveConnectivityBonus(state, ai, edge) {
    //edge : {a, b} (노드 id)
    //내 도로가 연결된 노드에 붙는다면 + 가산(매우 라이트한 휴리스틱)

    const myRoads = ai.roads || [];
    const touched = new Set();

    myRoads.forEach((r) => {
        touched.add(r.a);
        touched.add(r.b);
    });

    return (touched.has(edge.a) || touched.has(edge.b)) ? 3 : 0;
}

//전략 합성기
// 여러 전략을 합성 : 각 전략의 scoreAction 가중치를 모두 합산
export function composeStrategies(...strategies) {
    return {
        scoreAction(state, ai, action, helpers) {
            return strategies.reduce(
                (acc, s) => acc + (s.scoreAction ? s.scoreAction(state, ai, action, helpers) : 0),
                0
            );
        },

        chooseRobberTarget(state, ai, basePick) {
            //순차 변환: 앞 전략 -> 뒤 전략
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

//개별 전략들
/*
    1) 균형형(balanced) : 모든 행동에 적당한 보너스
    



*/
