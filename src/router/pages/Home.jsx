// 게임 보드 및 모든 UI를 포함하는 메인 화면입니다.

import React, {useState, useEffect} from "react";
import "../../styles/Home.css";
import GameBoard from '../../components/Board/Canvas';
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import PlayerPanel from "../../components/PlayerPanel/PlayerPanel";
import useGameStore from "../../features/state/gameStore";

const Home = () => {
	// 핀 표시 상태
	const [visibleCornerPins, setVisibleCornerPins] = useState([]);
	const [visibleEdgePins, setVisibleEdgePins] = useState([]);
	const [visibleTilePins, setVisibleTilePins] = useState([]);
	const [showChangePanel, setShowChangePanel] = useState(false);

  	// 버튼 핸들러
	const handleBuildRoad = () => {
		setVisibleEdgePins([2, 4, 10]); // 원하는 edge pin ID로 교체 가능
		setVisibleCornerPins([]);
		setVisibleTilePins([]);
	};

	const handleBuildVillage = () => {
		setVisibleCornerPins([1, 5, 8]); // 원하는 corner pin ID로 교체 가능
		setVisibleEdgePins([]);
		setVisibleTilePins([]);
	};

	const handleBuildCity = () => {
		setVisibleCornerPins([3, 6, 9]); // 원하는 city용 corner ID
		setVisibleEdgePins([]);
		setVisibleTilePins([]);
	};

	const handleExchange = () => {
		setShowChangePanel(prev => !prev);
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
				resources: [1,2,4,2,1], //자원 카드 현황 ["tree", "brick", "sheep", "wheat", "steel"]
				roads: [], //건설한 도로의 위치
				settlements: [], //건설한 마을의 위치
				cities: [], //도시의 위치
				devCards: [0,0,1,2,0], //보유한 개발 카드 목록 ["knight","victoryPoint", "roadBuilding", "yearOfPlenty", "monopoly"]
				useKnight: 0,   // 사용한 기사 카드의 개수
				points: 0, //현재 승점
			},
			{
				id: 2,
				name: "플레이어2",
				resources: [1,1,1,0,0],
				roads: [],
				settlements: [],
				cities: [],
				devCards: [0,0,0,0,0],
				useKnight: 0,
				points: 0,
			},
			{
				id: 3,
				name: "플레이어3",
				resources: [0,0,0,0,0],
				roads: [],
				settlements: [],
				cities: [],
				devCards: [1,2,3,1,0],
				useKnight: 0,
				points: 0,
			},
			{
			id: 4,
				name: "플레이어4",
				resources: [0,0,0,0,0],
				roads: [],
				settlements: [],
				cities: [],
				devCards: [0,0,0,0,0],
				useKnight: 0,
				points: 0,
			},
		]);
		initBoard([]);
	}, []);

	return (
		<main id="main">
			<div>
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
					players = {players}
				/>
			</div>
			<PlayerPanel players={players} />
		</main>
	);
};

export default Home;