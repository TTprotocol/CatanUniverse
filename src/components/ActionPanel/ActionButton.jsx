import React from "react";
import useGameStore from "../../features/state/gameStore";

export default function ActionButton({
	className,
	onClick,
	children,
	isDice,
	...props
}) {
	const { players, currentPlayerIndex, phase } = useGameStore();
	const isDiceButton = isDice === true || className.includes("rollDice"); // isDice prop 또는 기존 rollDice className으로 주사위 버튼 여부를 판별합니다.

	// 자원 배열 형태 가정 : [나무(0), 벽돌(1), 양(2), 밀(3), 철(4)]
	const currentResources = players[currentPlayerIndex]?.resources || [
		0, 0, 0, 0, 0,
	];
	const [wood, brick, sheep, wheat, steel] = currentResources;

	let isActionAllowed = true;

	if (className.includes("buildRoad")) {
		isActionAllowed = wood >= 1 && brick >= 1; // 도로 버튼은 나무 1개와 벽돌 1개가 있을 때만 활성화합니다.
	} else if (className.includes("buildVillage")) {
		isActionAllowed = wood >= 1 && brick >= 1 && sheep >= 1 && wheat >= 1; // 마을 버튼은 필요한 네 가지 자원이 모두 있을 때만 활성화합니다.
	} else if (className.includes("buildCity")) {
		isActionAllowed = wheat >= 2 && steel >= 3; // 도시 버튼은 밀 2개와 철 3개가 있을 때만 활성화합니다.
	} else if (className.includes("development")) {
		isActionAllowed = sheep >= 1 && wheat >= 1 && steel >= 1; // 개발카드 버튼은 양, 밀, 철이 각각 1개 이상 있을 때만 활성화합니다.
	}

	if (currentPlayerIndex !== 0) {
		isActionAllowed = false; // 내 턴이 아니면 phase와 자원 상태에 상관없이 모든 버튼을 비활성화합니다.
	} else if (phase === "ROLL") {
		isActionAllowed = isDiceButton; // 내 턴의 ROLL 단계에는 주사위 버튼만 활성화합니다.
	} else if (isDiceButton) {
		isActionAllowed = false; // ROLL 단계가 아니면 주사위 버튼만 비활성화합니다.
	}

	const statusClass = isActionAllowed ? "highlight" : "disabled";

	return (
		<button
			className={`action-btn ${className} ${statusClass}`}
			onClick={isActionAllowed ? onClick : undefined}
			disabled={!isActionAllowed}
			{...props}
		>
			{children}
		</button>
	);
}
