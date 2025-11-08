import React from "react";
import ResourceCard from "../Card/ResourceCard";
import useGameStore from "../../features/state/gameStore";

export default function TradeCardSection({
  type, // "receive" or "give"
  uniqueResources,
  resourceCounts,
  handleClick,
  handleReset,
}) {

    const players = useGameStore((state) => state.players);
    const me = players[0];
    const myResources = me?.resources || [0, 0, 0, 0, 0];

    const canClick = (res, count) => {
        const idx = ["tree", "brick", "sheep", "wheat", "steel"].indexOf(res);
        if (idx === -1) return false;
        const myCount = myResources[idx];
        return count < myCount;
    };

    return (
        <div className={`${type}Card`}>
            <div className="cardGroup">
                <div className="cardDisp">
                    {/* 화살표 SVG - 위/아래 방향은 type에 따라 분기 가능 */}
                    {type === "receive" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6-1">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6-1">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>

                <div className="wantedCard">
                    {["tree", "brick", "sheep", "wheat", "steel"].map((res) => {

                        const idx = ["tree", "brick", "sheep", "wheat", "steel"].indexOf(res);
                        const myCount = myResources[idx];
                        const currentCount = resourceCounts[res] || 0;

                        const disabled =
                        type === 'give' &&
                        (myCount <= 0 || !canClick(res, currentCount));
                        
                        return (
                            <button
                                key={res}
                                className={`${res}Wanted`}
                                onClick={() => !disabled && handleClick(res, type)}
                                disabled={disabled}
                                title={disabled ? "보유 카드 없음" : ""}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="cardDisplay">
                <div className="cardsWrapper">
                    {uniqueResources.map((res) => (
                        <ResourceCard key={res} type={res} count={resourceCounts[res]} />
                    ))}
                </div>
                <button className="resetButton" onClick={() => handleReset(type)}>
                    {/* 리셋 SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6-1">
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
