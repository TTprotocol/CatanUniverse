import React from "react";

export default function PlayerInfo({ isMe, playerClass, cards = [] }) {

    const resourceCount = cards
        .filter(c => c.category === 'resource')
        .reduce((sum, c) => sum+c.count,0);
        
    const developmentCount = cards
        .filter(c => c.category === 'development')
        .reduce((sum, c) => sum+c.count,0);

    const knightCount = cards
        .filter(c => c.category === 'development' && c.type === 'knight')
        .reduce((sum, c) => sum+c.count,0);

    const bridgeCount = cards
        .filter(c => c.category === 'development' && c.type === 'roadBuilding')
        .reduce((sum, c) => sum+c.count,0);

    return (
        <div className={`player ${playerClass} ${isMe ? "myProfile" : ""}`}>
            <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="countSourceCard">
                {resourceCount > 0 && <div className="countBadge">{resourceCount}</div>}
            </div>
            <div className="countProgCard">
                {developmentCount > 0 && <div className="countBadge">{developmentCount}</div>}
            </div>
            <div className="countKnight">
                {knightCount > 0 && <div className="countBadge">{knightCount}</div>}
            </div>
            <div className="countBridge">
                {bridgeCount > 0 && <div className="countBadge">{bridgeCount}</div>}
            </div>
        </div>
    );
}