// 플레이어의 자원, 개발 카드, 점수 등을 표시하는 패널 UI입니다.
import React from "react";
import "../../styles/PlayerPanel.css";
import Bank from "./Bank";
import PlayerInfo from "./PlayerInfo";

export default function PlayerPanel({ cards }) {
    return (
        <section className="playerPanel">
            <div className="log"></div>

            <div className="otherPlayers">
                <Bank />
                <PlayerInfo playerClass="player1" cards={cards} />
                <PlayerInfo playerClass="player2" cards={cards} />
                <PlayerInfo playerClass="player3" cards={cards} />
            </div>

            <PlayerInfo isMe={true} playerClass="" cards={cards} />
        </section>
    );
}
