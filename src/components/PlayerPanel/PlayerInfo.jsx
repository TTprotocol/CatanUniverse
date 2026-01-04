import React from "react";

export default function PlayerInfo({ 
    isMe, 
    playerClass, 
    resources=[],
    devCards=[], 
    roads=[], 
    useKnight,
    isCurrent,
}) {

    // 배열인지 확인, 아니면 빈 배열로 처리
    const resourceCount = Array.isArray(resources) ? resources.reduce((sum, c) => sum + c, 0) : 0;
    const developmentCount = Array.isArray(devCards) ? devCards.reduce((sum, c) => sum + c, 0) : 0;

    const knightCount = typeof useKnight === "number" ? useKnight : 0;
    const bridgeCount = Array.isArray(roads) ? roads.length : 0;

    return (
        <div className={`player playerInfoCard ${playerClass} ${isMe ? "myProfile" : ""} ${isCurrent ? "active" : ""}`}>
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