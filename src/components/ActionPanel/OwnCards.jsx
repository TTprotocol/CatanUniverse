import React, { useState } from "react";
import ResourceCard from "../Card/ResourceCard";
import DevelopmentCard from "../Card/DevelopmentCard";
import useGameStore from "../../features/state/gameStore";
import DevCardUsePanel from "./DevCardUsePanel";

export default function OwnCards({ players = [] }) {
	const me = Array.isArray(players) && players.length > 0 ? players[0] : null;
	const phase = useGameStore((s) => s.phase);
	const actionsThisTurn = useGameStore((s) => s.actionsThisTurn);
	const [selectedCardIndex, setSelectedCardIndex] = useState(null);

	if (!me) return null;

	const RESOURCE_TYPES = ["tree", "brick", "sheep", "wheat", "steel"];
	const DEV_CARD_TYPES = ["knight", "victoryPoint", "roadBuilding", "yearOfPlenty", "monopoly"];

	const canUseCard = phase === "ACTION" && !actionsThisTurn.devCardUsed;

	const handleCardClick = (index) => {
		console.log("클릭됨", index, "phase:", phase, "canUseCard:", canUseCard);
		if (!canUseCard) return;
		if (index === 1) return; // 승점 카드는 패시브
		setSelectedCardIndex(index === selectedCardIndex ? null : index);
	};

	return (
		<div className="ownCards">
			<div className="ownResourceCard">
				{(Array.isArray(me.resources) ? me.resources : []).map((count, index) =>
					count > 0 ? (
						<ResourceCard
							key={RESOURCE_TYPES[index]}
							type={RESOURCE_TYPES[index]}
							count={count}
						/>
					) : null,
				)}
			</div>
			<div className="borderStick"></div>
			<div className="ownDevelopmentCard">
				{(Array.isArray(me.devCards) ? me.devCards : []).map((count, index) =>
					count > 0 ? (
						<DevelopmentCard
							key={DEV_CARD_TYPES[index]}
							type={DEV_CARD_TYPES[index]}
							count={count}
							onClick={() => handleCardClick(index)}
							className={`${canUseCard && index !== 1 ? "usable" : ""} ${selectedCardIndex === index ? "selected" : ""}`}
						/>
					) : null,
				)}

				{selectedCardIndex !== null && (
					<DevCardUsePanel
						cardIndex={selectedCardIndex}
						onClose={() => setSelectedCardIndex(null)}
					/>
				)}
			</div>
		</div>
	);
}