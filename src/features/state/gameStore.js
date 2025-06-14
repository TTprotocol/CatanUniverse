// 전체 게임 상태를 관리하는 상태 저장소입니다. (Zustand 또는 Context 기반)
// zustand 사용. 게임의 상태를 관리한다.

// zustand에서 create 함수를 가져온다.
// 상태 관리를 위한 라이브러리
import { create } from "zustand";

// set : 상태 업데이트할 때 사용
// get : 현재 상태를 가져올 때 사용
const useGameStore = create((set, get) => ({
	// ✅ 현재 턴인 플레이어 인덱스 (0부터 시작)
	currentPlayerIndex: 0,

	// ✅ 전체 플레이어 정보
	// 게임 시작 시 initPlayers()로 채운다.
	players: [
		// AI도 이 배열에 포함
	],

	// ✅ 보드 상태
	board: {
		tiles: [], // 육각 타일 목록 (자원 종류, 숫자, 위치 등)
		robber: null, // 도둑이 위치한 타일 ID
	},

	// ✅ 게임 상태
	dice: null, //주사위 값 (2~12)
	phase: "ROLL", // ROLL, BUILD, TRADE 등
	longestRoadOwner: null, // 최장 교역로 보유자 (플레이어 ID)
	largestArmyOwner: null, // 최강 기사단 보유자 (플레이어 ID)
	winner: null, // 승자가 결정되면 플레이어 ID 저장

	// ✅ 액션 함수 예시
	rollDice: () => {
		const dice =
			Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
		set({ dice }); // set({ dice }): dice 상태를 새 값으로 업데이트
		// 주사위 숫자에 따라 자원 분배 로직을 이후에 연결
	},

	// ✅ 다음 플레이어로 턴을 넘김
	endTurn: () => {
		const nextIndex = (get().currentPlayerIndex + 1) % get().players.length; // get()으로 현재 상태를 가져와 nextIndex를 계산
		set({ currentPlayerIndex: nextIndex, phase: "ROLL", dice: null }); // set()으로 상태 변경
	},

	// 정착지를 건설할 때 사용하는 함수
	// get()으로 현재 상태 확인, set()으로 업데이트
	buildSettlement: (position) => {
		const index = get().currentPlayerIndex;
		const players = [...get().players]; // 기존 배열 복사
		players[index].settlements.push(position); // 혀재 플레이어의 정착지(마을) 추가
		players[index].points += 1; // 점수 1점 추가

		set({ players }); // 상태 업데이터
	},

	// 게임 시작용 초기화 함수
	initPlayers: (playerList) => set({ players: playerList }), // 플레이어 설정
	initBoard: (tiles, robberPos) => set({ board: { tiles, robber: robberPos } }), // 보드 설정
}));

export default useGameStore;

/**
 * 사용하는 방법
 *
 * 읽기 : useGameStore(state => state.players)
 * 쓰기 : useGameStore.getState().buildSettlement(...) or useGameStore(state => state.buildSettlement)
 */
