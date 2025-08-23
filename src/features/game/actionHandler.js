// 플레이어의 행동(건설, 도둑 이동, 교환 등)을 처리하는 로직입니다.

//1) 플레이어 건설
// - 정착지 건설(buildSettlement)
// - 도시 업그레이드(upgradeToCity)
// props
// - players : 플레이어 배열
// - setPlayers : players 상태를 바꾸는 setter

export const useBuildActions = ({players, setPlayers}) => {
    //정착지(마을) 건설
    const buildSettlement = (playerId, location, adjacentTiles) => {
        //정착지 건설 비용(카탄 기본 규칙)
        const cost = {
            나무 : 1,
            벽돌 : 1,
            밀 : 1,
            양 : 1,
        };

        //건설하려는 플레이어 찾기
        const player = players.find((p) => p.id === playerId);

        //(보호) 플레이어가 없을 경우 예외
        if(!player) {
            throw new Error('플레이어를 찾을 수 없습니다.');
        }

        //이미 그 위치에 해당 플레이어의 건물이 있으면 불가
        if(player.buildings.some((b) => b.location === location)) {
            throw new Error('이미 건물이 있는 위치입니다.');
        }

        //비용을 지불할 충분한 자원이 있는지 확인
        const hasResources = Object.entries(cost).every(
            ([type, amount]) => (player.resources[type] || 0) >= amount
        );

        if(!hasResources) {
            throw new Error('자원이 부족합니다.');
        }

        //실제로 보드 교차점에 붙은 타일들(자원 분배할 때 사용)
        const newBuilding = {
            type : 'settlement', 
            location, 
            adjacentTiles,
        };

        //비용 차감 + 새 건물 추가
        const updatedPlayer = {
            ...player,
            resources : Object.fromEntries(
                Object.entries(player.resources).map(([type, value]) => [
                    type,
                    value - (cost[type] || 0),
                ])
            ),

            buildings: [...player.buildings, newBuilding],
        };

        setPlayers(players.map((p) => p.id === playerId ? updatedPlayer : p));
    };

    //마을을 도시로 바꿀때 로직
    const upgradeToCity = (playerId, location) => {

        //도시로 업그레이드 하는 비용(카탄 규칙)
        const cost = {
            밀 : 2, 
            철 : 3,
        };

        //대상 플레이어 찾기
        const player = players.find((p) => p.id === playerId);
        if(!player) {
            throw new Error('플레이어를 찾을 수 없습니다.');
        }

        //해당 위치에 정착지(마을)가 있어야 도시 업그레이드 가능
        const index = player.buildings.findIndex(
            (b) => b.location === location && b.type === 'settlement'
        );

        if(index === -1) {
            throw new Error('정착지가 없습니다.');
        };

        //비용 지불 가능 여부 체크
        const hasResources = Object.entries(cost).every(
            ([type, amount]) => (player.resources[type] || 0) >= amount
        );

        if(!hasResources) {
            throw new Error('자원이 부족합니다.');
        }

        //해당 건물을 도시로 변경
        const updatedBuildings = [...player.buildings];
        updatedBuildings[index].type = 'city';

        //비용 차감 후 상태 반영
        const updatedPlayer = {
            ...player,
            resources: Object.fromEntries(
                Object.entries(player.resources).map(([type, value]) => [
                    type,
                    value - (cost[type] || 0),
                ])
            ),
            buildings : updatedBuildings,
        };

        setPlayers(players.map(p => (p.id === playerId ? updatedPlayer : p)));
    };

    return {
        buildSettlement, 
        upgradeToCity,
    };


}

//2) 도둑 관련 로직(주사위 합 7일 때)

//- 8장 이상 보유 -> 절반 버리기
// 도둑 이동
// 도둑 인접 플레이어에게서 자원 1장 강탈


//주사위 굴림 -> 합이 7일 때의 처리 예시
const rollDice = () => {
    const diceOne = Math.ceil(Math.random() * 6);
    const diceTwo = Math.ceil(Math.random() * 6);
    const sum = diceOne + diceTwo;

    if(sum === 7) {
        //1. 자원 8장 이상인 플레이어 -> 갖고 있는 자원 절반 버리기
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

        //3. 강탈 대상 선택(도둑이 위치한 타일에 인접 건물이 있는 상대)
        const victims = players.filter((p) => 
            p.id !== currentPlayer.id && 
            p.buildings?.some(b => b.adjacentHexes.includes(newHexId))
        );

        if(victims.length > 0) {
            const victim = victims[0];
            const {updatedFrom, updatedTo} = robResources(victim, currentPlayer);
            
            //피해자 / 가해자만 교체한 새로운 players 만들기
            const nextPlayers = players.map(p => {
                if(p.id === victim.id) {
                    return updatedFrom; //카드 1장 잃은 피해자
                }

                if(p.id === currentPlayer.id) {
                    return updatedTo; //카드 1장 얻은 도둑()
                }

                return p;
            });

            setPlayers(nextPlayers);
        }
    }

}

    //도둑이 있는 땅은 자원 생산 차단
    // - 특정 타일(hexId / resourceType)에 대해, 도둑이 해당 타일에 있으면 생산하지 않음
    // - 그 타일과 인접한 건물을 가진 플레이어에게 자원을 지급
    const distributeResources = (hexId, resourceType) => {
    
    //도둑이 있으면 자원 생산 차단
    if(hexId === robberHex) {
        return;
    }

    const updated = player.map((player) => {

        //해당 플레이어가 이 타일에 인접한 건물을 보유했는지
        const getsFromTile = player.buildings?.some((b) => 
            b.adjacentHexes.includes(hexId)
        );

        if(!getsFromTile) {
            return player; //인접하지 않으면 변화 없음
        }

        //자원 1장 지급

        return {
            ...player, 
            resources : {
                ...player.resources,
                [resourceType] : (player.resources[resourceType] || 0) + 1
            },
        };
    });
}



//3) 자원 교환

//3-1 : 플레이어 간 자원 교환

export const tradeBetweenPlayers = (fromPlayer, toPlayer, offer, request) => {
    //offer/request : {자원 종류 : 개수}
    
    //A가 제안한 offer를 보유하고 있는지 확인
    for(const [type, amount] of Object.entries(offer || {})) {
        if((fromPlayer.resources[type] || 0) < amount) {
            throw new Error(`${fromPlayer.name}의 ${type} 자원이 부족합니다.`);
        }
    }

    //B가 제안한 request를 보유하고 있는지 확인
    for(const [type, amount] of Object.entries(request || {})) {
        if((toPlayer.resources[type] || 0) < amount) {
            throw new Error(`${toPlayer.name}의 ${type} 자원이 부족합니다.`);
        }
    }

    //교환처리로직: from -> to(offer), to-> from(request)
    const newFrom = { ...fromPlayer.resources };
    const newTo = { ...toPlayer.resources };

    //from이 내놓는 자원 -> to에게 증가
    for (const [type, amount] of Object.entries(offer)) {
        newFrom[type] -= amount;
        newTo[type] = (newTo[type] || 0) + amount;
    }

    //to가 내놓는 자원 -> from에게 증가
    for (const [type, amount] of Object.entries(request)) {
        newTo[type] -= amount;
        newFrom[type] = (newFrom[type] || 0) + amount;
    }

    //갱신된 두 플레이어 반환
    return [
        {...fromPlayer, resources: newFrom},
        {...toPlayer, resources: newTo},
    ];

}

//3-2 : 은행 교환
export const tradeWithBank = (player, giveType, receiveType) => {
    
    //기본 4:1
    let rate = 4;
    
    //특수 항구 2:1 
    if(player.ports.includes(giveType)) {
        rate = 2;
    } 
    //일반 항구 3:1    
    else if(player.ports.includes('any')) {
        rate = 3;
    }

    //교환에 필요한 수량 보유 여부 확인
    if((player.resources[giveType] || 0 ) < rate) {
        throw new Error(`${giveType} 자원이 ${rate}개 이상 있어야 교환이 가능합니다.`);
    }

    //자원 차감 / 증가 반영
    return {
        ...player,
        resources : {
            ...player.resources,
            [giveType] : player.resources[giveType] - rate,
            [receiveType] : (player.resources[receiveType] || 0) + 1,
        },
    };

}