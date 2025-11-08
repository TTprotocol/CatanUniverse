// 주사위 결과에 따라 자원을 각 플레이어에게 분배하는 로직을 처리합니다.
import useGameStore, { gameLog } from "../state/gameStore";
import {
	RESOURCE_TYPE,
	DEFAULT_TILES,
	CORNER_PIN,
	EDGE_PIN,
	TILE_PIN,
} from "@/utils/constants";

const distributeResourcesByDice = () => {
	//현재 플레이어 정보, 보드 상태, 현재 턴 인덱스를 가져옴
	const { players, board, currentPlayerIndex } = useGameStore.getState();
	const { addLog } = gameLog.getState();

	//주사위 총합 (두 주사위의 합) 값 가져오기
	const dice = useGameStore.getState().dice;

	//보드에서 육각 타일 정보와 도둑 위치 가져오기
	const { tiles, robber } = board;

	// 주사위를 아직 굴리지 않았거나, 7이 나와 도둑 처리 단계라면 자원분배 스킵
	if (!dice || dice === 7) return; // 도둑처리 진행

	// 현재 도둑이 있는 타일에 걸렸다면, 도둑 처리 진행
	if (tiles.id === robber) return;

	// 1. 주사위 숫자에 해당하는 타일 필터링해서 찾기
	const matchedTiles = [...tiles].filter((tile) => tile.number === dice); // 주사위 숫자의 타일 찾기 => id, resourceId 필요
	const matchedId = new Set(matchedTiles.map((tile) => tile.id)); // 해당 타일의 id만 추출

	const matchedCornerPins = TILE_PIN.filter((tile) => matchedId.has(tile.id)); // 타일 id로 TILE_PIN의 타일 찾기 => corner 배열 필요

	const getTiles = [...matchedTiles].map((tile) => {
		const tileId = tile.id;
		const corner = matchedCornerPins
			.filter((tilePin) => tilePin.id === tileId)
			.pop().corner;

		return { id: tile.id, resourceId: tile.resourceId, corner };
	});

	// console.log("getTiles : ", getTiles);

	// if (matchedTiles.length === 0) return;   // 주사위 숫자에 해당하지 않는 타일이 없을 수가 있나...?

	// 2. 각 플레이어별 자원 계산
	const updatedPlayers = players.map((player) => {
		//기존 자원 상태 복사
		const newResources = { ...player.resources };

		//플레이어가 보유한 건물(정착지, 도시)를 순회
		// 1. 정착지 순회
		player.settlements.length !== 0 &&
			getTiles.forEach((tile) => {
				player.settlements.forEach((settlement) => {
					if (tile.corner.includes(settlement)) {
						// console.log(RESOURCE_TYPE[tile.resourceId] + " 정착지 자원 ++");
						addLog(
							`정착지 ${settlement}에 ${
								RESOURCE_TYPE[tile.resourceId]
							} 자원 1개를 추가합니다.`
						);
						newResources[tile.resourceId]++;
					}
				});
			});

		// 2. 도시 순회
		player.cities.length !== 0 &&
			getTiles.forEach((tile) => {
				player.cities.forEach((city) => {
					if (tile.corner.includes(city)) {
						// console.log(RESOURCE_TYPE[tile.resourceId] + " 도시 자원 += 2");
						addLog(
							`도시 ${city}에 ${
								RESOURCE_TYPE[tile.resourceId]
							} 자원 2개를 추가합니다.`
						);
						newResources[tile.resourceId]++;
					}
				});
			});

		// player.buildings?.forEach((building) => {
		// 	console.log("distributeResourcesByDice building: ", building);
		// 	//건물에 인접한 타일을 순회
		// 	building.adjacentTiles.forEach((tileId) => {
		// 		console.log("distributeResourcesByDice tileId: ", tileId);
		// 		//현재 타일이 주사위 숫자와 일치하는 타일인지 확인
		// 		const tile = matchedTiles.find((t) => t.id === tileId);
		// 		console.log("distributeResourcesByDice tile: ", tile);

		// 		//타일이 없거나, 도둑이 위치해 있거나, 사막이면 자원 생성 안됨
		// 		if (!tile || tile.id === robber || tile.resource === "사막") return;

		// 		//도시면 자원 2개, 정착지면 자원 1개 획득
		// 		const amount = building.type === "city" ? 2 : 1;
		// 		console.log("distributeResourcesByDice amount: ", amount);

		// 		//해당 자원 종류 누적
		// 		newResources[tile.resource] =
		// 			(newResources[tile.resource] || 0) + amount;
		// 		console.log("distributeResourcesByDice newResources: ", newResources);
		// 	});
		// });

		//해당 플레이어의 자원 업데이트
		return { ...player, resources: newResources };
	});

	// 3. 플레이어 상태 업데이트
	useGameStore.setState({ players: updatedPlayers });

	// 4. 게임 로그에 자원 분배 기록 추가
	const currentPlayer = players[currentPlayerIndex];
	addLog(`${currentPlayer.name}의 주사위 결과에 따라 자원을 분배했습니다.`);
};

export default distributeResourcesByDice;
