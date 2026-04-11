import React, { useState, useEffect, useCallback } from "react";
import "@/styles/Home.css";
import "@/styles/Intro.css";
import GameBoard from "@/components/Board/Canvas";
import ActionPanel from "@/components/ActionPanel/ActionPanel";
import PlayerPanel from "@/components/PlayerPanel/PlayerPanel";
import VictoryScreen from "./VictoryScreen";
import AiTurnManager from "../../features/ai/AiTurnManager";
import useGameStore, { pinManagement } from "@/features/state/gameStore";
import {
	useCheckRoad,
	useCheckSettlement,
	useCheckCity,
} from "@/features/game/actionHandler";
import islandImg from "../../assets/island_intro.png";
import { aiTurn } from "@/features/ai/aiDecisionMaker";
import DiceRoller from "../../components/Dice/DiceRoller";

const Home = () => {
	// === 1. 화면 전환 상태 관리 ===
	// 'start': 시작화면, 'loading': 로딩화면, 'game': 게임화면
	const [viewState, setViewState] = useState("start");
	const [loadingProgress, setLoadingProgress] = useState(0);

	// === 2. 기존 게임 핀 상태 관리 ===
	const [visibleCornerPins, setVisibleCornerPins] = useState([]);
	const [visibleEdgePins, setVisibleEdgePins] = useState([]);
	const [visibleTilePins, setVisibleTilePins] = useState([]);
	const [showChangePanel, setShowChangePanel] = useState(false);

	// Store에서 필요한 함수들 가져오기
	const { players, initPlayers, initBoard, phase, currentPlayerIndex } = useGameStore();
	const { setCornerPin, setEdgePin, setRobber } = pinManagement();

	// === 3. 로딩 타이머 로직 ===
	useEffect(() => {
		let timer;

		// viewState가 'loading'일 때만 타이머 실행
		if (viewState === "loading") {
			timer = setInterval(() => {
				setLoadingProgress((prev) => {
					// 100% 도달 시
					if (prev >= 100) {
						// 여기서 clearInterval을 하지 않아도,
						// setViewState가 바뀌면 cleanup 함수가 실행되어 자동으로 정리됩니다.
						setViewState("game");
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
		setViewState("loading");
	};

	// 도로 건설 핸들러
	const handleBuildRoad = async () => {
		if (visibleEdgePins.length === 0) {
			const nextEdge = await useCheckRoad();
			setVisibleEdgePins([...nextEdge]);
			setVisibleCornerPins([]);
			setVisibleTilePins([]);
		} else {
			setVisibleEdgePins([]);
		}
	};

	// 마을 건설 핸들러
	const handleBuildVillage = async () => {
		if (visibleCornerPins.length === 0) {
			const nextCorner = await useCheckSettlement();
			setVisibleCornerPins([...nextCorner]);
			setVisibleEdgePins([]);
			setVisibleTilePins([]);
		} else {
			setVisibleCornerPins([]);
		}
	};

	// 도시 건설 핸들러
	const handleBuildCity = async () => {
		if (visibleCornerPins.length === 0) {
			const nextCorner = await useCheckCity();
			setVisibleCornerPins([...nextCorner]);
			setVisibleEdgePins([]);
			setVisibleTilePins([]);
		} else {
			setVisibleCornerPins([]);
		}
	};

	// 교환 핸들러
	const handleExchange = () => {
		setShowChangePanel((prev) => !prev);
	};

	//주사위 굴리기
	const rollDice = useGameStore((state) => state.rollDice);

	const handleRollDice = () => {
		rollDice();
	};

	const handleEndTurn = () => {
		useGameStore.getState().endTurn();
	};

	// === 5. 게임 데이터 초기화 ===
	useEffect(() => {
		useGameStore.getState().initAll();
		initPlayers([
			{
				id: 1,
				name: "me",
				resources: [1, 2, 4, 2, 1],
				roads: [2, 8, 13, 14, 15, 16, 17, 18, 20, 21],
				settlements: [1, 10, 11],
				cities: [9],
				devCards: [0, 0, 1, 2, 0],
				useKnight: 0,
				points: 0,
			},
			{
				id: 2,
				name: "player1",
				resources: [1, 1, 1, 0, 0],
				roads: [],
				settlements: [],
				cities: [],
				devCards: [0, 0, 0, 0, 0],
				useKnight: 0,
				points: 0,
			},
			{
				id: 3,
				name: "player2",
				resources: [0, 0, 0, 0, 0],
				roads: [40],
				settlements: [],
				cities: [],
				devCards: [1, 2, 3, 1, 0],
				useKnight: 0,
				points: 0,
			},
			{
				id: 4,
				name: "player3",
				resources: [0, 0, 0, 0, 0],
				roads: [],
				settlements: [],
				cities: [],
				devCards: [0, 0, 0, 0, 0],
				useKnight: 0,
				points: 0,
			},
		]);
		initBoard([], 10);
		[1, 9, 10, 11].forEach((item) => setCornerPin(item));
		[2, 4, 8, 13, 14, 15, 16, 17, 18, 20, 21].forEach((item) =>
			setEdgePin(item),
		);
	}, []);

	// AI 턴 트리거
	useEffect(() => {
		if (!players || players.length === 0) return;
		if (phase === "GAME_OVER") return;
		if (currentPlayerIndex === 0) return; // 내 턴이면 건너뜀

		const timer = setTimeout(() => {
			aiTurn(currentPlayerIndex);
		}, 800);

		return () => clearTimeout(timer);
	}, [currentPlayerIndex]); // currentPlayerIndex 변경 시만 실행

	// === 6. 화면 렌더링 분기 ===

	// (A) 시작 화면
	if (viewState === "start") {
		return (
			<div className="introContainer">
				{/* 👇 1. 섬 이미지를 contentWrapper 밖으로 꺼냅니다 */}
				<img src={islandImg} alt="Catan Island" className="floatingIsland" />
				<AiTurnManager/>

				{/* 👇 2. 글자와 버튼만 남겨둡니다 (이제 섬이 밀어내지 않음) */}
				<div className="contentWrapper">
					<h1 className="gameTitle">CATAN UNIVERSE</h1>
					<button className="woodBtn" onClick={handleGameStart}>
						GAME START
					</button>
				</div>

				{/* 안개/파도 효과 */}
				<div className="ocean">
					<div className="wave"></div>
					<div className="wave"></div>
				</div>
			</div>
		);
	}

	// (B) 로딩 화면
	if (viewState === "loading") {
		return (
			<div className="loadingContainer">
				<h2 className="loadingText">Loading...</h2>
				<div className="loadingBarContainer">
					<div
						className="loadingBarFill"
						style={{ width: `${loadingProgress}%` }}
					></div>
				</div>
				<p className="loadingPercent">{loadingProgress}%</p>
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
				<DiceRoller />
				<ActionPanel
					showChangePanel={showChangePanel}
					handleExchange={handleExchange}
					handleBuildCity={handleBuildCity}
					handleBuildRoad={handleBuildRoad}
					handleBuildVillage={handleBuildVillage}
					handleRollDice={handleRollDice}
					handleEndTurn={handleEndTurn}
					players={players}
				/>
			</div>
			<PlayerPanel players={players} />

			{(phase === "ENDED" || phase === "GAME_OVER") && <VictoryScreen />}
		</main>
	);
};

export default Home;
