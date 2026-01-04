// 플레이어의 자원, 개발 카드, 점수 등을 표시하는 패널 UI입니다.
import React, {useEffect, useRef} from "react";
import "../../styles/PlayerPanel.css";
import Bank from "./Bank";
import PlayerInfo from "./PlayerInfo";
import useGameStore, {gameLog} from "../../features/state/gameStore";

export default function PlayerPanel({ players }) {

    const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);

    //1. gameLog스토어에서 로그 배열 가져오기
    const logs = gameLog((state) => state.log);
    //2.스크롤을 제어하기 위한 Ref생성
    const logContainerRef = useRef(null);
    //3. 로그가 업데이트 될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if(logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);
    return (
        <section className="playerPanel">
            {/* 4.ref연결 및 로그 데이터 매핑 */}
            <div className="log" ref={logContainerRef}>
                {logs.length === 0 ? (
                    <div style={{color: 'white', textAlign: 'center', marginTop: '10px'}}>
                        게임 시작 대기 중...
                    </div>
                ) : (
                    logs.map((message, index) => (
                        //key는 고유해야하니까.. 텍스트 로그니까... 인덱스로 쓸게요...
                        <div key={index} style={{marginBottom: '4px'}}>
                            {message}
                        </div>
                    ))
                )}
            </div>

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
                useKnight={players[0]?.useKnight || 0}
                isCurrent={currentPlayerIndex === 0}
            />
        </section>
    );
}
