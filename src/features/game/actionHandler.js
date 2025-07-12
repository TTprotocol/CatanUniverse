// 플레이어의 행동(건설, 도둑 이동, 교환 등)을 처리하는 로직입니다.
import useGameStore from "../game/gameStore";

//1) 플레이어 건설
export const useBuildActions = ({players, setPlayers}) => {

    //정착지를 건설하는 함수
    const buildSettlement = (playerId, location, adjacentTiles) => {

        //정착지 건설에 필요한 자원 비용
        const cost = {
            나무 : 1,
            벽돌 : 1,
            밀 : 1,
            양 : 1,
        };

        const player = players.find(p => p.id === playerId);

        //이미 해당 위치에 건물이 있으면 예외 처리
        if(player.buildings.some(b => b.location === location)) {
            throw new Error('이미 건물이 있는 위치입니다.');
        }

        //자원이 충분한지 확인
        const hasResources = Object.entries(cost).every(
            ([type, amount]) => (player.resources[type] || 0) >= amount
        );

        if(!hasResources) {
            throw new Error('자원이 부족합니다.');
        }

        //새 정착지 객체 생성
        const newBuilding = {
            type : 'settlements', 
            location, 
            adjacentTiles,
        };

        //플레이어의 자원 차감 및 건물 추가
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

        //상태 업데이트
        setPlayers(players.map(p => p.id === playerId ? updatedPlayer : p));
    };

    //정착지를 도시로 업그레이드 하는 함수
    const upgradeToCity = (playerId, location) => {
        const cost = {
            밀 : 2, 
            철 : 3,
        };

        //해당 위치에 정착지가 있는지 확인
        const player = players.find(p => p.id === playerId);
        const index = player.buildings.findIndex(b => b.location === location && b.type === 'settlement');
        if(index === -1) {
            throw new Error('정착지가 없습니다.');
        };

        //자원이 충분한지 확인
        const hasResources = Object.entries(cost).every(
            ([type, amount]) => (player.resources[type] || 0) >= amount
        );
        if(!hasResources) {
            throw new Error('자원이 부족합니다.');
        }

        //건물 타입을 도시로 변경
        const updatedBuildings = [...player.buildings];
        updatedBuildings[index].type = 'city';

        //자원 차감 및 상태 반영
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

        //상태 업데이트
        setPlayers(players.map(p => (p.id === playerId ? updatedPlayer : p)));
    };

    return {
        buildSettlement, upgradeToCity
    };


}

//2) 도둑 관련 로직

//주사위를 굴리는 함수
export const rollDice = () => {
    const diceOne = Math.ceil(Math.random() * 6);
    const diceTwo = Math.ceil(Math.random() * 6);
    const sum = diceOne + diceTwo;

    const players = useGameStore.getState().players;
    const currentPlayerIndex = useGameStore.getState().currentPlayerIndex;
    const currentPlayer = players[currentPlayerIndex];

    //상태 저장 (주사위 결과)
    useGameStore.setState({ dice1: diceOne, dice2: diceTwo, dice: sum });

    //주사위 합이 7 → 도둑 이벤트 발동
    if (sum === 7) {
        //자원 8장 이상인 플레이어 → 절반 폐기
        const updatedPlayers = players.map((player) => {
        const totalResources = Object.values(player.resources).reduce((sum, count) => sum + count, 0);

        if (totalResources > 7) {
            const toDiscard = Math.floor(totalResources / 2);
            return discardResourcesRandomly(player, toDiscard);
        }

            return player;
        });

        useGameStore.setState({ players: updatedPlayers });

        //도둑을 새 타일로 이동 (UI에서 선택한 값 사용 필요)
        const newTileId = "hex10"; // 임시값: 실제로는 유저 입력 또는 자동 설정
        const board = useGameStore.getState().board;
        useGameStore.setState({ board: { ...board, robber: newTileId } });

        //도둑 인접 플레이어 중 강탈 대상 찾기
        const victims = updatedPlayers.filter(
        (p) =>
            p.id !== currentPlayer.id &&
            p.buildings?.some((b) => b.adjacentTiles.includes(newTileId))
        );

        if (victims.length > 0) {
        const victim = victims[0]; // 임시: 실제는 UI에서 선택 가능

        const { updatedFrom, updatedTo } = robResources(victim, currentPlayer);

        const finalPlayers = updatedPlayers.map((p) => {
            if (p.id === victim.id) return updatedFrom;
            if (p.id === currentPlayer.id) return updatedTo;
            return p;
        });

        useGameStore.setState({ players: finalPlayers });

        useGameStore
            .getState()
            .addLog(`${currentPlayer.name} 님이 ${victim.name} 님의 자원을 1장 훔쳤습니다.`);
        }

        return; // 도둑 이벤트 처리 후 종료
    }

    //7이 아닌 경우는 자원 분배
    useGameStore.getState().addLog(`${currentPlayer.name} 님이 주사위를 굴렸습니다: ${diceOne} + ${diceTwo} = ${sum}`);
};

// 타일 자원 분배 (단, 도둑이 있는 타일은 차단)
export const distributeResources = (tileId, resourceType) => {
    const { players, board } = useGameStore.getState();
    const { robber } = board;

    //도둑이 있는 타일이면 분배 중단
    if (tileId === robber) return;

    //인접 건물이 있는 플레이어에게 자원 분배
    const updatedPlayers = players.map((player) => {
        const hasAdjacent = player.buildings?.some((b) => b.adjacentTiles.includes(tileId));
        if (!hasAdjacent) return player;

        return {
        ...player,
        resources: {
            ...player.resources,
            [resourceType]: (player.resources[resourceType] || 0) + 1,
        },
        };
    });

    useGameStore.setState({ players: updatedPlayers });
};


//3) 자원 교환
export const useTradeActions = ({players, setPlayers}) => {
    const tradeWithBank = (playerId, giveResource, getResource) => {
        const player = players.find((p) => p.id === playerId);
        if(!player) throw new Error('플레이어를 찾을 수 없습니다.');

        const harborRatio = getHarborRatio(player, giveResource);
        const giveAmount = harborRatio;

        //자원 보유 확인
        if((player.resources[giveResource] || 0) < giveAmount) {
            throw new Error(`${giveResource} 자원이 부족합니다.`);
        }

        //자원 업데이트
        const updatedPlayer = {
            ...player,
            resources : {
                ...player.resources,
                [giveResource] : player.resources[giveResource] - giveAmount,
                [getResource] : (player.resources[getResource] || 0) + 1,
            },
        };

        setPlayers(players.map((p) => (p.id === playerId ? updatedPlayer : p)));
    };

    const getHarborRatio = (player, resourceType) => {
        //자원이 맞는 특수 항구가 있으면 2:1, 일반 항구는 3:1, 기본은 4:1

        const hasSpecifiHarbor = player.harbors?.includes(`2 : ${resourceType}`);
        if(hasSpecifiHarbor) return 2;

        const hasGeneralHarbor = player.harbors?.includes('3:1');
        if(hasGeneralHarbor) return 3;

        return 4;
    };

    return {tradeWithBank};
}
