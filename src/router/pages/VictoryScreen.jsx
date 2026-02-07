import React from 'react';
import Confetti from 'react-confetti';
import useGameStore from '../../features/state/gameStore'; // 경로는 프로젝트 구조에 맞게 확인해주세요
import '../../styles/Intro.css';

const VictoryScreen = () => {
    const winner = useGameStore((state) => state.winner);
    const initAll = useGameStore((state) => state.initAll); // 초기화 함수 가져오기
    
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 재시작 함수
    const handleRestart = () => {
        initAll(); // 1. 게임 데이터(점수, 자원 등) 초기화
        window.location.reload(); // 2. 페이지 새로고침으로 깔끔하게 시작
    };

    return (
        <div className="victory-overlay">
            <Confetti
                width={width}
                height={height}
                numberOfPieces={300}
                gravity={0.1}
            />

            <div className="victory-content">
                <h1 className="victory-title">VICTORY!</h1>
                <h2 className="winner-text">
                    🎉 {winner} 님이 승리하셨습니다! 축하합니다! 🎉
                </h2>
                
                <button 
                    className="woodBtn" 
                    onClick={handleRestart}
                    style={{ marginTop: "30px", fontSize: "24px", padding: "15px 40px" }}
                >
                    새 게임 시작
                </button>
            </div>
        </div>
    );
};

export default VictoryScreen;