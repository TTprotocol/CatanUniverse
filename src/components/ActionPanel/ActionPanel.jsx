import React from "react";
import "../../styles/ChangeCardPanel.css";
import ChangeCardPanel from "../ChangeCardPanel/ChangeCardPanel";
import ActionButton from "./ActionButton";
import OwnCards from "./OwnCards"

export default function ActionPanel({
    showChangePanel,
    handleExchange,
    handleBuildRoad,
    handleBuildVillage,
    handleBuildCity,
}) {
    return (
        <section className="actionPanel">
        <OwnCards
            // resourceCards = {{tree:2, brick:2, sheep:1, wheat:1, steel:2}}
            // developmentCards = {{knight:1, monopoly:1, roadBuilding:1, victoryPoint:1}}
        />

        {showChangePanel && (
            <ChangeCardPanel />
        )}

        <div className="actions">
            <ActionButton className="changeCards" onClick={handleExchange}>
            {/* 교환 아이콘 */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.22-3.22H7.5a.75.75 0 0 1 0-1.5h11.69l-3.22-3.22a.75.75 0 0 1 0-1.06Zm-7.94 9a.75.75 0 0 1 0 1.06l-3.22 3.22H16.5a.75.75 0 0 1 0 1.5H4.81l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
            </ActionButton>

            <ActionButton className="development">
            <div></div>
            </ActionButton>

            <ActionButton className="buildRoad" onClick={handleBuildRoad}>
            <div></div>
            </ActionButton>

            <ActionButton className="buildVillage" onClick={handleBuildVillage}>
            <div></div>
            </ActionButton>

            <ActionButton className="buildCity" onClick={handleBuildCity}>
            <div></div>
            </ActionButton>

            <ActionButton className="endTurn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
            </ActionButton>
        </div>
        </section>
    );
}