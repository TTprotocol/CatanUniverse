// 주사위 결과에 따라 자원을 각 플레이어에게 분배하는 로직을 처리합니다.
import useGameStore from "../state/gameStore";

const distributeResourcesByDice = () => {
	//현재 플레이어 정보, 보드 상태, 현재 턴 인덱스를 가져옴
	const { players, board, currentPlayerIndex } = useGameStore.getState();
	console.log("distributeResourcesByDice players : ", players);
	console.log("distributeResourcesByDice board : ", board);
	console.log(
		"distributeResourcesByDice currentPlayerIndex : ",
		currentPlayerIndex
	);

	//주사위 총합 (두 주사위의 합) 값 가져오기
	const dice = useGameStore.getState().dice;
	console.log("distributeResourcesByDice dice : ", dice);

	//보드에서 육각 타일 정보와 도둑 위치 가져오기
	const { tiles, robber } = board;
	console.log("distributeResourcesByDice tiles : ", tiles);
	console.log("distributeResourcesByDice robber : ", robber);

	// 주사위를 아직 굴리지 않았거나, 7이 나와 도둑 처리 단계라면 자원분배 스킵
	if (!dice || dice === 7) return; // 도둑처리 진행

	// 현재 도둑이 있는 타일에 걸렸다면, 도둑 처리 진행
	if (robber.number === dice) return;

	// 1. 주사위 숫자에 해당하는 타일 필터링해서 찾기
	const matchedTiles = tiles.filter((tile) => tile.number === dice);

	console.log("distributeResourcesByDice matchedTiles : ", matchedTiles);

	// if (matchedTiles.length === 0) return;   // 주사위 숫자에 해당하지 않는 타일이 없을 수가 있나...?

	// 2. 각 플레이어별 자원 계산
	const updatedPlayers = players.map((player) => {
		console.log("distributeResourcesByDice player: ", player);
		//기존 자원 상태 복사
		const newResources = { ...player.resources };
		console.log("distributeResourcesByDice newResources: ", newResources);

		//플레이어가 보유한 건물(정착지, 도시)를 순회

		// 1. 정착지 순회
		player.settlements.length !== 0 &&
			player.settlements.forEach((building) => {
				console.log("distributeResourcesByDice building : ", building);
			});

		// 2. 도시 순회

		player.buildings?.forEach((building) => {
			console.log("distributeResourcesByDice building: ", building);
			//건물에 인접한 타일을 순회
			building.adjacentTiles.forEach((tileId) => {
				console.log("distributeResourcesByDice tileId: ", tileId);
				//현재 타일이 주사위 숫자와 일치하는 타일인지 확인
				const tile = matchedTiles.find((t) => t.id === tileId);
				console.log("distributeResourcesByDice tile: ", tile);

				//타일이 없거나, 도둑이 위치해 있거나, 사막이면 자원 생성 안됨
				if (!tile || tile.id === robber || tile.resource === "사막") return;

				//도시면 자원 2개, 정착지면 자원 1개 획득
				const amount = building.type === "city" ? 2 : 1;
				console.log("distributeResourcesByDice amount: ", amount);

				//해당 자원 종류 누적
				newResources[tile.resource] =
					(newResources[tile.resource] || 0) + amount;
				console.log("distributeResourcesByDice newResources: ", newResources);
			});
		});

		//해당 플레이어의 자원 업데이트
		return { ...player, resources: newResources };
	});

	console.log("distributeResourcesByDice updatedPlayers: ", updatedPlayers);
	// 3. 플레이어 상태 업데이트
	useGameStore.setState({ players: updatedPlayers });
	console.log("distributeResourcesByDice updatedPlayers: ", updatedPlayers);

	// 4. 게임 로그에 자원 분배 기록 추가
	const currentPlayer = players[currentPlayerIndex];
	useGameStore
		.getState()
		.addLog(`${currentPlayer.name}의 주사위 결과에 따라 자원을 분배했습니다.`);
};

export default distributeResourcesByDice;
