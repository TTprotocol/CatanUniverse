// 플레이어의 점수를 계산하는 함수
// - settlements: 정착지 배열
// - cities: 도시 배열
// - hasLongestRoad: 최장 교역로 보유 여부
// - hasLargestArmy: 최강 기사단 보유 여부
// - victoryPointCards: 승점 카드 개수

export const calculateScore = (player) => {
    
    let score = 0;

    // 정착지 1점씩
    score += (player.settlements?.length || 0);

    // 도시는 2점씩
    score += (player.cities?.length || 0) * 2;

    // 최장 교역로 보유자 보너스
    if (player.hasLongestRoad) {
        score += 2;
    }

    // 최강 기사단 보유자 보너스
    if (player.hasLargestArmy) {
        score += 2;
    }

    // 승점 카드 점수
    score += (player.victoryPointCards || 0);

    return score;
};

    // 모든 플레이어 중 승자가 있는지 확인하는 함수
    // players 배열을 순회하면서 10점 이상인 플레이어를 찾음

export const checkForWinner = (players) => {
    for (const player of players) {
        const score = calculateScore(player);
            if (score >= 10) {
            return player; // 승자 반환
        }
    }
    return null; // 아직 승자 없음
};
