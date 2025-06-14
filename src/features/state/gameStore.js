// 전체 게임 상태를 관리하는 상태 저장소입니다. (Zustand 또는 Context 기반)
// zustand 사용. 게임의 상태를 관리한다.

import { create } from "zustand"; // 상태 관리를 위한 라이브러리
import { persist } from "zustand/middleware";

// set : 상태 업데이트할 때 사용
// get : 현재 상태를 가져올 때 사용
const useGameStore = create(
	// persist() : Zustand 상태를 localStorage에 자동 저장/복원
	persist(
		(set, get) => ({
			// ✅ 현재 턴인 플레이어 인덱스 (0부터 시작)
			currentPlayerIndex: 0,

			// ✅ 전체 플레이어 정보
			// 게임 시작 시 initPlayers()로 채운다.
			players: [
				// AI도 이 배열에 포함
				// 플레이어 정보 예제
				// {
				// 	id: 1, // 아이디
				// 	name: "플레이어1", // 이름
				// 	resources: {}, // 자원 카드 현황
				// 	roads: [], // 건설한 도로의 위치
				// 	settlements: [], // 건설한 정착지(마을)의 위치
				// 	cities: [], // 도시의 위치
				// 	devCards: [], // 보유한 개발 카드 목록
				// 	points: 0, // 현재 승점
				// },
			],

			// ✅ 보드 상태
			board: {
				tiles: [], // 육각 타일 목록 (자원 종류, 숫자, 위치 등)
				robber: null, // 도둑이 위치한 타일 ID
			},

			// ✅ 게임 상태
			log: [], // 게임 로그 저장
			dice1: null, // 첫 번째 주사위 숫자
			dice2: null, // 두 번째 주사위 숫자
			dice: null, // 두 주사위 합
			phase: "ROLL", // ROLL, BUILD, TRADE 등
			longestRoadOwner: null, // 최장 교역로 보유자 (플레이어 ID)
			largestArmyOwner: null, // 최강 기사단 보유자 (플레이어 ID)
			winner: null, // 승자가 결정되면 플레이어 ID 저장

			// 게임의 로그를 저장하는 함수
			addLog: (message) => {
				const prev = get().log; // 이전 로그 값을 가져온다.
				const time = new Date().toLocaleTimeString(); // 현재 시간을 구한다
				set({ log: [...prev, `[${time}] ${message}`] }); // 로그에 현재 시간과 현재 로그를 기록한다.
			},

			resetLog: () => set({ log: [] }),

			// ✅ 주사위를 굴리는 함수
			rollDice: () => {
				const dice1 = Math.floor(Math.random() * 6 + 1);
				const dice2 = Math.floor(Math.random() * 6 + 1);
				const dice = dice1 + dice2;
				set({ dice1, dice2, dice }); // set({ dice1, dice2, dice }): dice 상태를 새 값으로 업데이트
				// 주사위 숫자에 따라 자원 분배 로직을 이후에 연결

				// 🎲 로그 저장
				get().addLog(
					`${
						get().players[get().currentPlayerIndex % get().players.length].name
					} 님이 주사위를 굴렸습니다: ${dice1} + ${dice2} = ${dice}`
				);
			},

			// ✅ 다음 플레이어로 턴을 넘김
			endTurn: () => {
				const nextIndex = (get().currentPlayerIndex + 1) % get().players.length; // get()으로 현재 상태를 가져와 nextIndex를 계산

				// 로그 저장
				get().addLog(
					`${
						get().players[get().currentPlayerIndex % get().players.length].name
					} 님이 턴을 넘겼습니다 : ${
						get().players[get().currentPlayerIndex % get().players.length].name
					} -> ${get().players[nextIndex].name}`
				);

				set({ currentPlayerIndex: nextIndex, phase: "ROLL", dice: null }); // set()으로 상태 변경
			},

			// 정착지를 건설할 때 사용하는 함수
			// get()으로 현재 상태 확인, set()으로 업데이트
			buildSettlement: (position) => {
				const index = get().currentPlayerIndex;
				const players = [...get().players]; // 기존 배열 복사
				players[index].settlements.push(position); // 현재 플레이어의 정착지(마을) 추가
				players[index].points += 1; // 점수 1점 추가

				// 로그 저장
				get().addLog(
					`${
						get().players[get().currentPlayerIndex % get().players.length].name
					} 님이 턴을 넘겼습니다 : ${
						get().players[get().currentPlayerIndex % get().players.length].name
					} -> ${get().players[nextIndex].name}`
				);

				set({ players }); // 상태 업데이트
			},

			// 게임 시작용 초기화 함수
			initPlayers: (playerList) => set({ players: playerList }), // 플레이어 설정
			initBoard: (tiles, robberPos) =>
				set({ board: { tiles, robber: robberPos } }), // 보드 설정

			// 게임 상태 초기화 함수
			initAll: () =>
				set({
					log: [],
					dice1: null,
					dice2: null,
					dice: null,
					phase: "ROLL",
					longestRoadOwner: null,
					largestArmyOwner: null,
					winner: null,
				}),
		}),
		{
			name: "catan_store", // localStorage 키 이름
			getStorage: () => localStorage, // 기본값은 localStorage, 필요 시 sessionStorage 등으로 변경 가능
			partialize: (state) => ({
				// 저장할 항목만 선택적으로 지정 (예: 보드, 플레이어 등)
				currentPlayerIndex: state.currentPlayerIndex,
				log: state.log,
				players: state.players,
				board: state.board,
				dice: state.dice,
				phase: state.phase,
				longestRoadOwner: state.longestRoadOwner,
				largestArmyOwner: state.largestArmyOwner,
				winner: state.winner,
			}),
		}
	)
);

export default useGameStore;

/**
 * 사용하는 방법
 *
 * 읽기 : useGameStore(state => state.players)
 * 쓰기 : useGameStore.getState().buildSettlement(...) or useGameStore(state => state.buildSettlement)
 *
 * 초기화 함수 예시
 * // 초기 상태를 강제로 재설정할 때 (예: 새 게임 시작 버튼 클릭 시)
 * useGameStore.setState({
 *      currentPlayerIndex: 0,
 *      log: state.log,
 *      players: [],
 *      board: { tiles: [], robber: null },
 *      dice: null,
 *      phase: "ROLL",
 *      longestRoadOwner: null,
 *      largestArmyOwner: null,
 *      winner: null,
 * });
 *
 *
 */
