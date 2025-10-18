// 게임 보드 및 모든 UI를 포함하는 메인 화면입니다.

import React, {useState} from "react";
import "../../styles/Home.css";
import GameBoard from '../../components/Board/Canvas';
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import PlayerPanel from "../../components/PlayerPanel/PlayerPanel";

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

	const [cards, setCards] = useState([
        { category: "resource", type: "tree", count: 2 },
        { category: "resource", type: "brick", count: 2 },
        { category: "resource", type: "sheep", count: 1 },
        { category: "resource", type: "wheat", count: 1 },
        { category: "resource", type: "steel", count: 2 },
        { category: "development", type: "knight", count: 1 },
        { category: "development", type: "victoryPoint", count: 1 },
        { category: "development", type: "roadBuilding", count: 1 },
        { category: "development", type: "monopoly", count: 2 },
    ]);

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
					cards = {cards}
				/>
			</div>
			<PlayerPanel cards={cards} />
		</main>
	);
};

export default Home;