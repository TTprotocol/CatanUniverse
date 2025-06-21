// 플레이어의 행동(건설, 도둑 이동, 교환 등)을 처리하는 로직입니다.

//1) 플레이어 건설
const useBuildActions = ({players, setPlayers}) => {
    const buildSettlement = (playerId, location, adjacentHexes) => {
        const cost = {
            '나무' : 1,
            '벽돌' : 1,
            '밀' : 1,
            '양' : 1,
        };

        const player = players.find(p => p.id === playerId);

        if(player.buildings.some(b => b.location === location)) {
            throw new Error('이미 건물이 있는 위치입니다.');
        }

        const hasResources = Object.entries(cost).every([type, amount]) => (player.resources[type])
    }
}







//2) 도둑 관련 로직

//주사위 합 7일 때

const rollDice = () => {
    const diceOne = Math.ceil(Math.random() * 6);
    const diceTwo = Math.ceil(Math.random() * 6);
    const sum = diceOne + diceTwo;

    if(sum === 7) {
        //1. 자원 8장 이상인 플레이어 -> 갖고있는 자원 절반 버리기
        const updatedPlayers = players.map(player => {
            const totalResources = countResources(player);

            if(totalResources > 7) {
                const toDiscard = Math.floor(totalResources / 2);
                return discardResourcesRandomly(player, toDiscard);
            }
            return player;
        });
        setPlayers(updatedPlayers);

        //2. 도둑 이동
        setRobberHex(newHexId); //다른 땅으로 이동

        //3. 강탈 대상 선택
        const victims = players.filter(p => 
            p.id !== currentPlayer.id && 
            p.buildings?.some(b => b.adjacentHexes.includes(newHexId))
        );

        if(victims.length > 0) {
            const victim = victims[0];
            const {updatedFrom, updatedTo} = robResources(victim, currentPlayer);
            const nextPlayers = players.map(p => {
                if(p.id === victim.id) {
                    return updatedFrom;
                }

                if(p.id === currentPlayer.id) {
                    return updatedTo;
                }

                return p;
            });

            setPlayers(nextPlayers);
        }
    }

}

    //도둑이 있는 땅은 자원 생산 차단
    const distributeResources = (hexId, resourceType) => {
    
    //도둑이 있으면 자원 생산 차단
    if(hexId === robberHex) {
        return;
    }

    const updated = player.map((player) => {
        const getsFromTile = player.buildings?.some(b => b.adjacentHexes.includes(hexId));
        if(!getsFromTile) {
            return player;
        }

        return {
            ...player, 
            resources : {
                ...player.resources,
                [resourceType] : (player.resources[resourceType] || 0) + 1
            }
        }
    })
}