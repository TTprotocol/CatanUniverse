// 전체 게임 상태를 관리하는 상태 저장소입니다. (Zustand 또는 Context 기반)
// zustand 사용. 게임의 상태를 관리한다.

import { create } from "zustand"; // 상태 관리를 위한 라이브러리
import { persist } from "zustand/middleware";
import { DEFAULT_TILES, TILE_PIN } from "@/utils/constants";

import distributeResourcesByDice from "../game/resourceDistributor"; // 자원분배 로직

// 모든 플레이어를 통틀어서 사용된 핀들을 관리.
export const pinManagement = create(
	persist(
		(set, get) => ({
			cornerPin: [],
			edgePin: [],
			robber: 7, // 기본 타일 핀 번호 : 7

			// 마을/도시 핀 관리
			setCornerPin: (pinId) =>
				set((state) => ({ cornerPin: [...state.cornerPin, pinId] })),

			// 도로 핀 관리
			setEdgePin: (pinId) =>
				set((state) => ({ edgePin: [...state.edgePin, pinId] })),

			// 도둑 핀 관리
			setRobber: (pinId) => {
				set(() => ({ robber: pinId }));
			},

			// 마을/도시 핀 사용 여부 확인
			getCornerPins: (pinId) => {
				return get().cornerPin.includes(pinId);
			},

			// 도로 핀 사용 여부 확인
			getEdgePins: (pinID) => {
				return get().edgePin.includes(pinID);
			},

			// 도둑 핀 위치 확인
			getRobber: () => {
				return get().robber;
			},

			// 핀 초기화
			reset: () => set({ cornerPin: [], edgePin: [] }),
		}),
		{
			name: "pin_management",
			getStorage: () => localStorage,
			partialize: (state) => ({
				cornerPin: state.cornerPin,
				edgePin: state.edgePin,
			}),
		}
	)
);

// 게임 전체 로그 관리
export const gameLog = create(
	persist(
		(set, get) => ({
			log: [], // 게임 로그 저장

			// 게임의 로그를 저장하는 함수
			addLog: (message) => {
				const prev = get().log; // 이전 로그 값을 가져온다.
				const time = new Date().toLocaleTimeString(); // 현재 시간을 구한다
				set({ log: [...prev, `[${time}] ${message}`] }); // 로그에 현재 시간과 현재 로그를 기록한다.
			},

			// 로그 초기화
			resetLog: () => set({ log: [] }),
		}),
		{
			name: "game_log",
			getStorage: () => localStorage,
			partialize: (state) => ({
				log: state.log,
			}),
		}
	)
);

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
				// 	resources: [], // 자원 카드 현황
				// 	roads: [], // 건설한 도로의 위치 (EDGE_PIN의 id)
				// 	settlements: [], // 건설한 정착지(마을)의 위치 (CORNER_PIN의 id)
				// 	cities: [], // 도시의 위치 (CORNER_PIN의 id)
				// 	devCards: [], // 보유한 개발 카드 목록
				//  useKnight: 0,   // 사용한 기사 카드의 개수
				// 	points: 0, // 현재 승점
				// },
			],

			// ✅ 보드 상태
			board: {
				tiles: [], // 육각 타일 목록 (자원 종류, 숫자, 위치 등)
				robber: null, // 도둑이 위치한 타일 ID
			},

			// ✅ 게임 상태
			dice1: null, // 첫 번째 주사위 숫자
			dice2: null, // 두 번째 주사위 숫자
			dice: null, // 두 주사위 합
			phase: "ROLL", // ROLL, BUILD, TRADE 등
			points: 0, // 현재 플레이어의 승점
			resources: [0, 0, 0, 0, 0], // 현재 플레이어의 자원 [나무, 벽돌, 양, 밀, 철]
			longestRoadOwner: null, // 최장 교역로 보유자 (플레이어 ID)
			largestArmyOwner: null, // 최강 기사단 보유자 (플레이어 ID)
			winner: null, // 승자가 결정되면 플레이어 ID 저장

			// 현재 턴을 진행중인 플레이어를 반환
			getCurPlayer: () => {
				const { players, currentPlayerIndex } = get();
				return players[currentPlayerIndex];
			},

			// 실제 게임 유저만 반환
			getCurPlayer: (userId = 0) => {
				const { players } = get();
				return players[userId];
			},

			// ✅ 주사위를 굴리는 함수
			rollDice: () => {
				const dice1 = Math.floor(Math.random() * 6 + 1);
				const dice2 = Math.floor(Math.random() * 6 + 1);
				const dice = dice1 + dice2;
				set({ dice1, dice2, dice }); // set({ dice1, dice2, dice }): dice 상태를 새 값으로 업데이트

				console.log(`dice1 : ${dice1}, dice2: ${dice2}, dice: ${dice}`);
				// 주사위 숫자에 따라 자원 분배 로직을 이후에 연결
				distributeResourcesByDice();

				// 🎲 로그 저장
				gameLog
					.getState()
					.addLog(
						`${
							get().players[get().currentPlayerIndex % get().players.length]
								.name
						} 님이 주사위를 굴렸습니다: ${dice1} + ${dice2} = ${dice}`
					);
			},

			// ✅ 다음 플레이어로 턴을 넘김
			endTurn: () => {
				const nextIndex = (get().currentPlayerIndex + 1) % get().players.length; // get()으로 현재 상태를 가져와 nextIndex를 계산

				// 로그 저장
				gameLog
					.getState()
					.addLog(
						`${
							get().players[get().currentPlayerIndex % get().players.length]
								.name
						} 님이 턴을 넘겼습니다 : ${
							get().players[get().currentPlayerIndex % get().players.length]
								.name
						} -> ${get().players[nextIndex].name}`
					);

				set({ currentPlayerIndex: nextIndex, phase: "ROLL", dice: null }); // set()으로 상태 변경
			},

			// 정착지를 건설할 때 사용하는 함수
			// get()으로 현재 상태 확인, set()으로 업데이트
			buildSettlement: (position) => {
				const index = get().currentPlayerIndex; // 현재 플레이어의 인덱스
				const players = [...get().players]; // 기존 플레이어 배열 복사

				// 마을 : [1, 1, 1, 1, 0], 포인트 += 1
				if (
					players[index].resources[0] <= 0 && // 나무
					players[index].resources[1] <= 0 && // 벽돌
					players[index].resources[2] <= 0 && // 양
					players[index].resources[3] <= 0 // 밀
				) {
					// 자원이 부족하거나,
					return { result: false, message: "자원이 부족합니다." };
				} else if (!pinManagement.getState().getCornerPins(position)) {
					// 이미 핀이 사용된 경우
					return { result: false, message: "해당 핀에 건설할 수 없습니다." };
				} else {
					players[index].settlements.push(position); // 현재 플레이어의 정착지(마을) 추가
					players[index].points += 1; // 점수 1점 추가
					pinManagement.getState().addCornerPin(position); // 핀 사용 처리

					// 자원 차감
					players[index].resources[0] -= 1; // 나무
					players[index].resources[1] -= 1; // 벽돌
					players[index].resources[2] -= 1; // 양
					players[index].resources[3] -= 1; // 밀

					// 로그 저장
					gameLog
						.getState()
						.addLog(
							`${players[index].name} 님이 ${position} 위치에 정착지를 건설했습니다.`
						);

					set({ players }); // 상태 업데이트

					return { result: true, message: "건설되었습니다." };
				}
			},

			// 정착지를 건설할 때 사용하는 함수
			// get()으로 현재 상태 확인, set()으로 업데이트
			buildCity: (position) => {
				const index = get().currentPlayerIndex; // 현재 플레이어의 인덱스
				const players = [...get().players]; // 기존 플레이어 배열 복사

				if (
					// 도시 : [0, 0, 0, 2, 3], 포인트 += 2
					players[index].resources[3] < 2 && // 밀
					players[index].resources[4] < 3 // 철
				) {
					// 자원이 부족한 경우
					return { result: false, message: "자원이 부족합니다." };
				} else if (!players[index].settlements.includes(position)) {
					// 플레이어에게 정착지가 없는 경우
					return { result: false, message: "정착지를 먼저 지어야 합니다." };
				} else {
					// 정착지가 있는지 확인
					players[index].cities.push(position); // 현재 플레이어의 도시 추가
					players[index].settlements = players[index].settlements.filter(
						(settlement) => settlement !== position
					);
					players[index].points += 2; // 점수 1점 추가

					// 자원 차감
					players[index].resources[3] -= 2; // 양
					players[index].resources[4] -= 3; // 밀

					// 로그 저장
					gameLog
						.getState()
						.addLog(
							`${players[index].name} 님이 ${position} 위치에 도시를 건설했습니다.`
						);

					set({ players }); // 상태 업데이트

					return { result: true, message: "건설되었습니다." };
				}
			},

			// 게임 시작용 초기화 함수
			initPlayers: (playerList) => set({ players: playerList }), // 플레이어 설정
			initBoard: (tiles, robberPos) => {
				set({
					board: {
						tiles: tiles.length === 0 ? DEFAULT_TILES : tiles,
						robber:
							robberPos === null || robberPos === undefined
								? pinManagement.getState().getRobber()
								: robberPos,
					},
				});
			}, // 보드 설정

			// 게임 상태 초기화 함수
			initAll: () =>
				set({
					currentPlayerIndex: 0,
					players: [],
					board: {
						tiles: [],
						robber: null,
					},
					dice1: null,
					dice2: null,
					dice: null,
					phase: "ROLL",
					resources: [0, 0, 0, 0, 0],
					longestRoadOwner: null,
					largestArmyOwner: null,
					winner: null,
					points: 0,
				}),
		}),
		{
			name: "catan_store", // localStorage 키 이름
			getStorage: () => localStorage, // 기본값은 localStorage, 필요 시 sessionStorage 등으로 변경 가능
			partialize: (state) => ({
				// 저장할 항목만 선택적으로 지정 (예: 보드, 플레이어 등)
				currentPlayerIndex: state.currentPlayerIndex,
				players: state.players,
				board: state.board,
				dice: state.dice,
				phase: state.phase,
				points: state.points,
				resources: state.resources,
				longestRoadOwner: state.longestRoadOwner,
				largestArmyOwner: state.largestArmyOwner,
				winner: state.winner,
			}),
		}
	)
);

export default useGameStore;

/**
 * 상태 저장소 사용 방법 정리
 *
 * 1. 컴포넌트 안에서 읽기 (리렌더링 필요할 때)
 *    - 패턴: useGameStore((state) => state.필드명 or 메서드명)
 *
 *    예시)
 *    import useGameStore, { gameLog, pinManagement } from "@/features/state/gameStore";
 *
 *    function ExampleComponent() {
 *      const players = useGameStore((state) => state.players);
 *      const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
 *      const rollDice = useGameStore((state) => state.rollDice);
 *
 *      const log = gameLog((state) => state.log);
 *
 *      const handleClick = () => {
 *        rollDice();
 *      };
 *
 *      return (
 *        <div>
 *          <div>현재 플레이어: {players[currentPlayerIndex]?.name}</div>
 *          <button onClick={handleClick}>주사위 굴리기</button>
 *          <pre>{log.join("\n")}</pre>
 *        </div>
 *      );
 *    }
 *
 *
 * 2. 컴포넌트 밖에서 읽기 (리렌더링 없이 값만 필요할 때)
 *    - 패턴: useGameStore.getState()
 *
 *    예시)
 *    // 예: 게임 유틸 함수, AI 로직 등 React 컴포넌트 바깥
 *    import useGameStore, { gameLog } from "@/features/state/gameStore";
 *
 *    export function someGameHelper() {
 *      const state = useGameStore.getState();
 *      const curPlayer = state.players[state.currentPlayerIndex];
 *
 *      gameLog.getState().addLog(`${curPlayer.name} 님의 보너스 턴이 시작되었습니다.`);
 *    }
 *
 *
 * 3. 컴포넌트 밖에서 쓰기 (상태 직접 변경)
 *    - 패턴: useGameStore.setState(새상태 or (prev) => 새상태)
 *
 *    예시)
 *    // 특정 상황에서 강제로 phase만 BUILD로 변경하고 싶은 경우
 *    useGameStore.setState((prev) => ({
 *      ...prev,
 *      phase: "BUILD",
 *    }));
 *
 *
 * 4. 초기화/새 게임 시작
 *    (1) 준비해 둔 initAll() 사용 권장
 *
 *        예시)
 *        // 새 게임 버튼 클릭 핸들러 등에서
 *        useGameStore.getState().initAll();  // 게임 전체 상태 초기화
 *        gameLog.getState().resetLog();      // 로그 초기화
 *        pinManagement.getState().reset();   // 핀 초기화
 *
 *
 *    (2) 직접 setState로 초기값을 설정하고 싶을 때
 *        - 반드시 gameStore 내부에서 정의한 초기 구조와 맞춰야 합니다.
 *
 *        예시)
 *        useGameStore.setState(() => ({
 *          currentPlayerIndex: 0,
 *          players: [],
 *          board: {
 *            tiles: [],
 *            robber: null,
 *          },
 *          dice1: null,
 *          dice2: null,
 *          dice: null,
 *          phase: "ROLL",
 *          resources: [0, 0, 0, 0, 0],
 *          longestRoadOwner: null,
 *          largestArmyOwner: null,
 *          winner: null,
 *          points: 0,
 *        }));
 *
 *        // 로그와 핀은 각각 별도 store 이므로, 따로 초기화해야 합니다.
 *        gameLog.getState().resetLog();
 *        pinManagement.getState().reset();
 *
 *
 * 5. pinManagement 사용 예시
 *
 *    예시)
 *    const { addCornerPin, getCornerPins } = pinManagement.getState();
 *
 *    // 코너 핀 사용
 *    if (!getCornerPins("corner-12")) {
 *      addCornerPin("corner-12");
 *    }
 *
 *
 * 6. gameLog 사용 예시
 *
 *    예시)
 *    const { addLog, resetLog } = gameLog.getState();
 *
 *    addLog("게임이 시작되었습니다.");
 *    // ...
 *    resetLog(); // 로그 전체 초기화
 */

// // 게임 보드 및 모든 UI를 포함하는 메인 화면입니다.

// import React from "react";
// import "../../styles/Home.css";
// import GameBoard from "./Canvas";
// import useGameStore from "../../features/state/gameStore";

// const Home = () => {
// 	const rollDice = useGameStore((state) => state.rollDice);
// 	const initPlayers = useGameStore((state) => state.initPlayers);
// 	const initBoard = useGameStore((state) => state.initBoard);

// 	const click = () => {
// 		initPlayers([
// 			{
// 				id: 1, // 아이디
// 				name: "플레이어1", // 이름
// 				resources: {}, // 자원 카드 현황
// 				roads: [], // 건설한 도로의 위치
// 				settlements: [], // 건설한 정착지(마을)의 위치
// 				cities: [], // 도시의 위치
// 				devCards: [], // 보유한 개발 카드 목록
// 				points: 0, // 현재 승점
// 			},
// 		]);

// 		initBoard([]);
// 		rollDice();
// 	};

// 	return (
// 		<>
// 			<button onClick={click}>테스트</button>
// 		</>
// 	);
// };

// export default Home;
