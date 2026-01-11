// 게임 보드 및 모든 UI를 포함하는 메인 화면입니다.

import React, { useState, useEffect } from "react";
import "@/styles/Home.css";
import GameBoard from "@/components/Board/Canvas";
import ActionPanel from "@/components/ActionPanel/ActionPanel";
import PlayerPanel from "@/components/PlayerPanel/PlayerPanel";
import useGameStore from "@/features/state/gameStore";
import {
	DEFAULT_TILES,
	CORNER_PIN,
	EDGE_PIN,
	TILE_PIN,
} from "@/utils/constants";

const Home = () => {
	// 핀 표시 상태
	const [visibleCornerPins, setVisibleCornerPins] = useState([]);
	const [visibleEdgePins, setVisibleEdgePins] = useState([]);
	const [visibleTilePins, setVisibleTilePins] = useState([]);
	const [showChangePanel, setShowChangePanel] = useState(false);

	//화면 전환 상태 관리
	const [viewState, setViewState] = useState('start');
	const [loadingProcess, setLoadingProgress] = useState(0);

	//시작화면 + 로딩화면
	useEffect(() => {
			let timer;
			if (viewState === 'loading') {
				timer = setInterval(() => {
					setLoadingProcess((prev) => {
						if(prev >= 100) {
							clearInterval(timer); //loading 100% 되면 게임 화면으로 전환
							setViewState('game');
							return 100;
						}
						return prev + 2;
					});
				}, 30); //0.03초마다 업데이트
			}
			return () => clearInterval(timer);
		}, [viewState]);

		const handleGameStart = () => {
			setViewState('loading');
		};

	// 다음에 지을 수 있는 도로 표시하기
	const checkCurrentUser = async () => {
		const {
			board,
			currentPlayerIndex,
			buildSettlement,
			buildCity,
			getCurPlayer,
		} = useGameStore.getState();

		console.log("currentPlayerIndex : ", currentPlayerIndex);
		console.log("getCurPlayer : ", getCurPlayer());

		

		const tempEdge = [];
		await getCurPlayer().settlements.forEach((item) => {
			const corner = CORNER_PIN.find((corner) => corner.id === item);
			if (!corner) return;

			tempEdge.push(...corner.edge);
		});
		await getCurPlayer().cities.forEach((item) => {
			const corner = CORNER_PIN.find((corner) => corner.id === item);
			if (!corner) return;

			tempEdge.push(...corner.edge);
		});
		const roadsSet = new Set(getCurPlayer().roads);
		const nextEdge = tempEdge.filter((v) => !roadsSet.has(v));
		console.log("nextEdge : ", nextEdge);

		return nextEdge;
	};

	// 버튼 핸들러
	const handleBuildRoad = async () => {
		const nextEdge = await checkCurrentUser();
		setVisibleEdgePins([...nextEdge]); // 원하는 edge pin ID로 교체 가능
		setVisibleCornerPins([]);
		setVisibleTilePins([]);
	};

	const handleBuildVillage = () => {
		setVisibleCornerPins([]); // 원하는 corner pin ID로 교체 가능
		setVisibleEdgePins([]);
		setVisibleTilePins([]);
	};

	const handleBuildCity = () => {
		setVisibleCornerPins([]); // 원하는 city용 corner ID
		setVisibleEdgePins([]);
		setVisibleTilePins([]);
	};

	const handleExchange = () => {
		setShowChangePanel((prev) => !prev);
	};

	// const rollDice = useGameStore((state) => state.rollDice);
	const initPlayers = useGameStore((state) => state.initPlayers);
	const initBoard = useGameStore((state) => state.initBoard);
	const players = useGameStore((state) => state.players);

	useEffect(() => {
		useGameStore.getState().initAll();
		initPlayers([
			{
				id: 1, //아이디
				name: "플레이어1", //이름
				resources: [1, 2, 4, 2, 1], //자원 카드 현황 ["tree", "brick", "sheep", "wheat", "steel"]
				roads: [2, 8], //건설한 도로의 위치
				settlements: [1], //건설한 마을의 위치
				cities: [9], //도시의 위치
				devCards: [0, 0, 1, 2, 0], //보유한 개발 카드 목록 ["knight","victoryPoint", "roadBuilding", "yearOfPlenty", "monopoly"]
				useKnight: 0, // 사용한 기사 카드의 개수
				points: 0, //현재 승점
			},
			{
				id: 2,
				name: "플레이어2",
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
				name: "플레이어3",
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
				name: "플레이어4",
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
	}, []);

	//시작화면
	if(viewState === 'start') {
		return (
			<div className="intro-container">
				<h1 className="title">CATAN UNIVERSE</h1>
				<button className="start-btn" onClick={handleGameStart}>GAME START</button>
			</div>
		);
	}

	//로딩화면
	if(viewState === 'loading') {
		return(
			<div className="intro-container">
				<h2 className="loading-text">Loading...</h2>
				<div className="loading-bar-container">
					<div className="loading-bar-fill" style={{width: `${loadingProcess}%`}}></div>
					<p className="loading-percent">{loadingProcess}%</p>
				</div>
			</div>
		);
	}

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
