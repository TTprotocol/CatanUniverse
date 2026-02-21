// src/components/VictoryScreen.jsx

import React from 'react';
import Confetti from 'react-confetti';
import useGameStore from '../../features/state/gameStore';
import '../../styles/Intro.css';

const VictoryScreen = () => {
    const winner = useGameStore((state) => state.winner);
    const initAll = useGameStore((state) => state.initAll);
    
    const width = window.innerWidth;
    const height = window.innerHeight;

    const handleRestart = () => {
        initAll();
        window.location.reload();
    };

    return (
        <div id='victory-background' className="victory-overlay">
            {/* 🎉 폭죽 효과 (오버레이 전체 화면에 뿌려짐) */}
            <Confetti
                width={width}
                height={height}
                numberOfPieces={400}
                gravity={0.15}
                style={{ zIndex: 10000 }} // 폭죽이 팝업창과 배경 사이에 터지게
            />

            {/* 📦 중앙 팝업 박스 */}
            <div className="victory-popup">
                <h1 className="victory-title" style={{ margin: "0 0 20px 0", fontSize: "70px" }}>
                    VICTORY!
                </h1>
                <h2 className="winner-text" style={{ fontSize: "28px", marginBottom: "40px", color: "#b8860b" }}>
                    🎉 <strong style={{ color: "#ffba00" }}>{winner || "테스터"}</strong> 님이 승리하셨습니다! 🎉
                </h2>
                
                <button 
                    className="woodBtn" 
                    onClick={handleRestart}
                    style={{ fontSize: "20px", padding: "12px 35px" }}
                >
                    새 게임 시작
                </button>
            </div>
        </div>
    );
};

export default VictoryScreen;