// 주사위 결과에 따라 자원을 각 플레이어에게 분배하는 로직을 처리합니다.
import useGameStore from "../game/gameStore";


const distributeResourcesByDice = () => {

	//현재 플레이어 정보, 보드 상태, 현재 턴 인덱스를 가져옴
	const { players, board, currentPlayerIndex } = useGameStore.getState();

	//주사위 총합 (두 주사위의 합) 값 가져오기
	const dice = useGameStore.getState().dice;

	//보드에서 육각 타일 정보와 도둑 위치 가져오기
	const { tiles, robber } = board;

	// 주사위를 아직 굴리지 않았거나, 7이 나와 도둑 처리 단계라면 자원분배 스킵
	if (!dice || dice === 7) return; 

	// 1. 주사위 숫자에 해당하는 타일 필터링해서 찾기
	const matchedTiles = tiles.filter((tile) => tile.number === dice);
	if (matchedTiles.length === 0) return;

  	// 2. 각 플레이어별 자원 계산
  	const updatedPlayers = players.map((player) => {

    //기존 자원 상태 복사
    const newResources = { ...player.resources };

    //플레이어가 보유한 건물(정착지, 도시)를 순회
    player.buildings?.forEach((building) => {

		//건물에 인접한 타일을 순회
		building.adjacentTiles.forEach((tileId) => {

        //현재 타일이 주사위 숫자와 일치하는 타일인지 확인
        const tile = matchedTiles.find((t) => t.id === tileId);

		//타일이 없거나, 도둑이 위치해 있거나, 사막이면 자원 생성 안됨
        if (!tile || tile.id === robber || tile.resource === "사막") return;

		//도시면 자원 2개, 정착지면 자원 1개 획득
        const amount = building.type === "city" ? 2 : 1;

		//해당 자원 종류 누적
        newResources[tile.resource] = (newResources[tile.resource] || 0) + amount;
      });
    });

	//해당 플레이어의 자원 업데이트
    return { ...player, resources: newResources };
  });

  // 3. 플레이어 상태 업데이트
  useGameStore.setState({ players: updatedPlayers });

  // 4. 게임 로그에 자원 분배 기록 추가
  const currentPlayer = players[currentPlayerIndex];
  useGameStore.getState().addLog(`${currentPlayer.name}의 주사위 결과에 따라 자원을 분배했습니다.`);
};

export default distributeResourcesByDice;


