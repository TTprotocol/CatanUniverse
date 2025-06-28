// 주사위 결과에 따라 자원을 각 플레이어에게 분배하는 로직을 처리합니다.
import useGameStore from "../game/gameStore";

//자원 타일 데이터
const tiles = [
    {
        id : 'tile1',
        number : 2,
        resource : '양',
    },

    {
        id : 'tile2',
        number : 3,
        resource : '나무',
    },

    {
        id : 'tile3',
        number : 3,
        resource : '철',
    },

    {
        id : 'tile4',
        number : 4,
        resource : '밀',
    },

    {
        id : 'tile5',
        number : 4,
        resource : '양',
    },

    {
        id : 'tile6',
        number : 5,
        resource : '양',
    },

    {
        id : 'tile7',
        number : 5,
        resource : '벽돌',
    },

    {
        id : 'tile8',
        number : 6,
        resource : '벽돌',
    },

    {
        id : 'tile9',
        number : 6,
        resource : '밀',
    },

    {
        id : 'tile10',
        number : 7,
        resource : '사막',
    },

    {
        id : 'tile11',
        number : 8,
        resource : '철',
    },

    {
        id : 'tile12',
        number : 8,
        resource : '나무',
    },

    {
        id : 'tile13',
        number : 9,
        resource : '밀',
    },

    {
        id : 'tile14',
        number : 9,
        resource : '나무',
    },

    {
        id : 'tile15',
        number : 10,
        resource : '벽돌',
    },

    {
        id : 'tile16',
        number : 10,
        resource : '철',
    },

    {
        id : 'tile17',
        number : 11,
        resource : '양',
    },

    {
        id : 'tile18',
        number : 11,
        resource : '나무',
    },

    {
        id : 'tile19',
        number : 12,
        resource : '밀',
    },
];


const distributeResourcesByDice = () => {
  const { players, board, currentPlayerIndex } = useGameStore.getState();
  const dice = useGameStore.getState().dice;
  const { tiles, robber } = board;

  if (!dice || dice === 7) return; // 도둑 이벤트는 여기서 제외

  // 1. 주사위 숫자에 해당하는 타일 찾기
  const matchedTiles = tiles.filter((tile) => tile.number === dice);
  if (matchedTiles.length === 0) return;

  // 2. 각 플레이어 자원 계산
  const updatedPlayers = players.map((player) => {
    const newResources = { ...player.resources };

    player.buildings?.forEach((building) => {
      building.adjacentTiles.forEach((tileId) => {
        const tile = matchedTiles.find((t) => t.id === tileId);
        if (!tile || tile.id === robber || tile.resource === "사막") return;

        const amount = building.type === "city" ? 2 : 1;
        newResources[tile.resource] = (newResources[tile.resource] || 0) + amount;
      });
    });

    return { ...player, resources: newResources };
  });

  // 3. 상태 저장
  useGameStore.setState({ players: updatedPlayers });

  // 4. 로그 기록
  const currentPlayer = players[currentPlayerIndex];
  useGameStore.getState().addLog(`${currentPlayer.name}의 주사위 결과에 따라 자원을 분배했습니다.`);
};

export default distributeResourcesByDice;


