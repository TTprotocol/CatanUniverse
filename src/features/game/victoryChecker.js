// 승리 조건(10점 도달 등)을 확인하고 게임 종료 여부를 판단합니다.

export const calculateScore = (player) => {
    
    let score = 0;

    score += player.settlements.length; //마을
    score += player.cities.length * 2; //도시

    //최장교역로
    if (player.hasLongestRoad) {
        score += 2;
    }

    //최강기사단
    if (player.hasLargestArmy) {
        score += 2;
    }

    //승점카드
    score += player.victoryPointCards;

    return score;

}

