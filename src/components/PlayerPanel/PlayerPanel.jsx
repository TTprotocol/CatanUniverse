// 플레이어의 자원, 개발 카드, 점수 등을 표시하는 패널 UI입니다.
import React from "react";
import "../../styles/PlayerPanel.css";
import Bank from "./Bank";
import PlayerInfo from "./PlayerInfo";
import useGameStore from "../../features/state/gameStore";

export default function PlayerPanel({ players }) {

    const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);

    return (
        <section className="playerPanel">
            <div className="log"></div>

            <div className="otherPlayers">
                <Bank />

                {players.slice(1).map((player, i) => (
                    <PlayerInfo
                        key={i}
                        playerClass={`player${i+1}`}
                        resources={player.resources}
                        devCards={player.devCards}
                        roads={player.roads}
                        useKnight={player.useKnight}
                        isCurrent={currentPlayerIndex === i +1}
                    />
                ))}
            </div>

            <PlayerInfo
                isMe={true}
                playerClass="" 
                resources={players[0]?.resources || 0}
                devCards={players[0]?.devCards || 0}
                roads={players[0]?.roads || 0}
                useKnight={players[0]?.useKnight || 0} />
        </section>
    );
}
