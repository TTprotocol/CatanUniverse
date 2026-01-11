import React, { useState, useEffect } from "react";
import "@/styles/Home.css";
import GameBoard from "@/components/Board/Canvas";
import ActionPanel from "@/components/ActionPanel/ActionPanel";
import PlayerPanel from "@/components/PlayerPanel/PlayerPanel";
import useGameStore from "@/features/state/gameStore";
import {
    CORNER_PIN,
    EDGE_PIN,
    TILE_PIN,
} from "@/utils/constants";

const Home = () => {
    // === 1. 화면 전환 상태 관리 ===
    // 'start': 시작화면, 'loading': 로딩화면, 'game': 게임화면
    const [viewState, setViewState] = useState('start');
    const [loadingProgress, setLoadingProgress] = useState(0);

    // === 2. 기존 게임 핀 상태 관리 ===
    const [visibleCornerPins, setVisibleCornerPins] = useState([]);
    const [visibleEdgePins, setVisibleEdgePins] = useState([]);
    const [visibleTilePins, setVisibleTilePins] = useState([]);
    const [showChangePanel, setShowChangePanel] = useState(false);

    // Store에서 필요한 함수들 가져오기
    const {
        initPlayers,
        initBoard,
        getCurPlayer,
        players,
    } = useGameStore();

    // === 3. 로딩 타이머 로직 ===
    useEffect(() => {
        let timer;
        
        // viewState가 'loading'일 때만 타이머 실행
        if (viewState === 'loading') {
            timer = setInterval(() => {
                setLoadingProgress((prev) => {
                    // 100% 도달 시
                    if (prev >= 100) {
                        // 여기서 clearInterval을 하지 않아도, 
                        // setViewState가 바뀌면 cleanup 함수가 실행되어 자동으로 정리됩니다.
                        setViewState('game'); 
                        return 100;
                    }
                    // 로딩 속도: 2씩 증가 (너무 느리면 답답하므로 속도 조절)
                    return prev + 2; 
                });
            }, 30); // 0.03초마다 실행
        }

        // Cleanup 함수: 컴포넌트가 바뀌거나 사라질 때 타이머 정지
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [viewState]);

    const handleGameStart = () => {
        setLoadingProgress(0); // 로딩바 초기화
        setViewState('loading');
    };

    // === 4. 게임 로직 (건설 가능 위치 계산) ===
    const checkCurrentUser = async () => {
        const tempEdge = [];
        const curPlayer = getCurPlayer();

        if (curPlayer) {
            // 내 마을 주변 엣지 탐색
            curPlayer.settlements.forEach((item) => {
                const corner = CORNER_PIN.find((corner) => corner.id === item);
                if (corner) tempEdge.push(...corner.edge);
            });
            // 내 도시 주변 엣지 탐색
            curPlayer.cities.forEach((item) => {
                const corner = CORNER_PIN.find((corner) => corner.id === item);
                if (corner) tempEdge.push(...corner.edge);
            });
            
            // 이미 지어진 도로 제외
            const roadsSet = new Set(curPlayer.roads);
            const nextEdge = tempEdge.filter((v) => !roadsSet.has(v));
            return nextEdge;
        }
        return [];
    };

    // 버튼 핸들러
    const handleBuildRoad = async () => {
        const nextEdge = await checkCurrentUser();
        setVisibleEdgePins([...nextEdge]); 
        setVisibleCornerPins([]);
        setVisibleTilePins([]);
    };

    const handleBuildVillage = () => {
        setVisibleCornerPins([]); 
        setVisibleEdgePins([]);
        setVisibleTilePins([]);
    };

    const handleBuildCity = () => {
        setVisibleCornerPins([]); 
        setVisibleEdgePins([]);
        setVisibleTilePins([]);
    };

    const handleExchange = () => {
        setShowChangePanel((prev) => !prev);
    };

    // === 5. 게임 데이터 초기화 ===
    useEffect(() => {
        useGameStore.getState().initAll();
        initPlayers([
            { id: 1, name: "플레이어1", resources: [1, 2, 4, 2, 1], roads: [2, 8], settlements: [1], cities: [9], devCards: [0, 0, 1, 2, 0], useKnight: 0, points: 0 },
            { id: 2, name: "플레이어2", resources: [1, 1, 1, 0, 0], roads: [], settlements: [], cities: [], devCards: [0, 0, 0, 0, 0], useKnight: 0, points: 0 },
            { id: 3, name: "플레이어3", resources: [0, 0, 0, 0, 0], roads: [40], settlements: [], cities: [], devCards: [1, 2, 3, 1, 0], useKnight: 0, points: 0 },
            { id: 4, name: "플레이어4", resources: [0, 0, 0, 0, 0], roads: [], settlements: [], cities: [], devCards: [0, 0, 0, 0, 0], useKnight: 0, points: 0 },
        ]);
        initBoard([], 10);
    }, []);

    // === 6. 화면 렌더링 분기 ===

    // (A) 시작 화면
    if (viewState === 'start') {
        return (
            <div className="intro-container">
                <h1 className="title">CATAN UNIVERSE</h1>
                <button className="start-btn" onClick={handleGameStart}>GAME START</button>
            </div>
        );
    }

    // (B) 로딩 화면
    if (viewState === 'loading') {
        return (
            <div className="intro-container">
                <h2 className="loading-text">Loading...</h2>
                <div className="loading-bar-container">
                    <div className="loading-bar-fill" style={{width: `${loadingProgress}%`}}></div>
                </div>
                <p className="loading-percent">{loadingProgress}%</p>
            </div>
        );
    }

    // (C) 메인 게임 화면
    return (
        <main id="main">
            <div id="wrap">
                <section className="board">
                    <GameBoard
                        visibleCorners={visibleCornerPins}
                        visibleEdges={visibleEdgePins}
                        visibleTiles={visibleTilePins}
                    />
                </section>
                <ActionPanel
                    showChangePanel={showChangePanel}
                    handleExchange={handleExchange}
                    handleBuildCity={handleBuildCity}
                    handleBuildRoad={handleBuildRoad}
                    handleBuildVillage={handleBuildVillage}
                    players={players}
                />
            </div>
            <PlayerPanel players={players} />
        </main>
    );
};

export default Home;