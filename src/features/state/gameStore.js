// 전체 게임 상태를 관리하는 상태 저장소입니다. (Zustand 또는 Context 기반)
// zustand 사용. 게임의 상태를 관리한다.

import { React } from "react";
import { create } from "zustand";

const useGameStore = create((set, get) => ({
	// ✅ 현재 플레이어 인덱스 (0부터 시작)
	currentPlayerIndex: 0,

	// ✅ 전체 플레이어 정보
	players: [
		// AI도 이 배열에 포함
	],

	// ✅ 보드 상태
	board: {
		tiles: [], // 자원 종류, 번호, 위치 등 포함
		robber: null, // 도둑이 위치한 타일 ID
	},

	// ✅ 게임 상태
	dice: null,
	phase: "ROLL", // ROLL, BUILD, TRADE 등
	winner: null,

	// ✅ 액션 함수 예시
	rollDice: () => {
		const dice =
			Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
		set({ dice });
		// 주사위 숫자에 따라 자원 분배 로직을 이후에 연결
	},

	endTurn: () => {
		const nextIndex = (get().currentPlayerIndex + 1) % get().players.length;
		set({ currentPlayerIndex: nextIndex, phase: "ROLL", dice: null });
	},

	buildSettlement: (position) => {
		const index = get().currentPlayerIndex;
		const players = [...get().players];
		players[index].settlements.push(position);
		players[index].points += 1;

		set({ players });
	},
}));

export default useGameStore;
