// 게임 보드 및 모든 UI를 포함하는 메인 화면입니다.

import React, { useState } from "react";
import "../../styles/Home.css";
import GameBoard from "../../components/Board/Canvas";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import PlayerPanel from "../../components/PlayerPanel/PlayerPanel";
//import generateRandomBoard from "../../features/board/boardGenerator";

const Home = () => {
  // 핀 표시 상태
  const [visibleCornerPins, setVisibleCornerPins] = useState([]);
  const [visibleEdgePins, setVisibleEdgePins] = useState([]);
  const [visibleTilePins, setVisibleTilePins] = useState([]);
  const [showChangePanel, setShowChangePanel] = useState(false);

  // 카드 상태
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

  // 핀 표시 관련 핸들러
  const handleBuildRoad = () => {
    setVisibleEdgePins([2, 4, 10]);
    setVisibleCornerPins([]);
    setVisibleTilePins([]);
  };

  const handleBuildVillage = () => {
    setVisibleCornerPins([1, 5, 8]);
    setVisibleEdgePins([]);
    setVisibleTilePins([]);
  };

  const handleBuildCity = () => {
    setVisibleCornerPins([3, 6, 9]);
    setVisibleEdgePins([]);
    setVisibleTilePins([]);
  };

  const handleExchange = () => setShowChangePanel((prev) => !prev);

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
          cards={cards}
        />
      </div>

      <PlayerPanel cards={cards} />
    </main>
  );
};

export default Home;
