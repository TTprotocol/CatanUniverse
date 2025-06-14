// 주사위 결과에 따라 자원을 각 플레이어에게 분배하는 로직을 처리합니다.



//자원 타일 데이터
const hexes = [
    {
        id : 'hex1',
        number : 2,
        resource : '양',
    },

    {
        id : 'hex2',
        number : 3,
        resource : '나무',
    },

    {
        id : 'hex3',
        number : 3,
        resource : '철',
    },

    {
        id : 'hex4',
        number : 4,
        resource : '밀',
    },

    {
        id : 'hex5',
        number : 4,
        resource : '양',
    },

    {
        id : 'hex6',
        number : 5,
        resource : '양',
    },

    {
        id : 'hex7',
        number : 5,
        resource : '벽돌',
    },

    {
        id : 'hex8',
        number : 6,
        resource : '벽돌',
    },

    {
        id : 'hex9',
        number : 6,
        resource : '밀',
    },

    {
        id : 'hex10',
        number : 7,
        resource : '사막',
    },

    {
        id : 'hex11',
        number : 8,
        resource : '철',
    },

    {
        id : 'hex12',
        number : 8,
        resource : '나무',
    },

    {
        id : 'hex13',
        number : 9,
        resource : '밀',
    },

    {
        id : 'hex14',
        number : 9,
        resource : '나무',
    },

    {
        id : 'hex15',
        number : 10,
        resource : '벽돌',
    },

    {
        id : 'hex16',
        number : 10,
        resource : '철',
    },

    {
        id : 'hex17',
        number : 11,
        resource : '양',
    },

    {
        id : 'hex18',
        number : 11,
        resource : '나무',
    },

    {
        id : 'hex19',
        number : 12,
        resource : '밀',
    },
];

//자원 분배 로직
const distributeResourcesByDice = (diceSum, hexes, players, setPlayers, robberHex) => {
    
    //1.주사위 숫자에 해당하는 타일 찾기
    const matchedHexes = hexes.filter(hex => hex.number === diceSum);

    if(matchedHexes.length === 0) {
        return;
    }

    const updatedPlayers = players.map(player => {
        const updatedResources = {...player.resources};
        player.buildings?.forEach(building => {
            building.adjacentHexes.forEach(hexId => {
                const hex = matchedHexes.find(h => h.id === hexId);
                
                //도둑이 있는 타일은 자원 생산 불가
                if(!hex || hex.id === robberHex) {
                    return;
                }

                const amount = building.type === 'city' ? 2 : 1;
                updatedResources[hex.resource] = (updatedResources[hex.resource] || 0) + amount;
            });
        });

        return {...player, resources: updatedResources};
    });

    setPlayers(updatedPlayers);

}

