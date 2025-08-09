// 게임 보드 및 모든 UI를 포함하는 메인 화면입니다.

import React, {useState} from "react";
import "../../styles/Home.css";
import GameBoard from './Canvas';

const Home = () => {
	// 핀 표시 상태
	const [visibleCornerPins, setVisibleCornerPins] = useState([]);
	const [visibleEdgePins, setVisibleEdgePins] = useState([]);
	const [visibleTilePins, setVisibleTilePins] = useState([]);

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
		//교환창만들기
	};

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
				<section className="actionPanel">
					<div className="ownCards"></div>
					<div className="actions">
						<button className="changeCards">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
								<path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
							</svg>
						</button>
						<button className="development" onClick={handleExchange}>
							<div></div>
						</button>
						<button className="buildRoad" onClick={handleBuildRoad}>
							<div></div>
						</button>
						<button className="buildVillage" onClick={handleBuildVillage}>
							<div></div>
						</button>
						<button className="buildCity" onClick={handleBuildCity}>
							<div></div>
						</button>
						<button className="endTurn">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" fill="currentColor" className="size-6">
  								<path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
							</svg>
						</button>
					</div>
				</section>
			</div>
			<section className="playerPanel">
				<div className="log"></div>
				<div className="otherPlayers">
					<div className="bank">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
							<path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
							<path fill-rule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clip-rule="evenodd" />
							<path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
						</svg>
						<div className="bankTree"></div>
						<div className="bankBrick"></div>
						<div className="bankSheep"></div>
						<div className="bankWheat"></div>
						<div className="bankSteel"></div>
						<div className="bankprog"></div>
					</div>
					<div className="player player1">
						<div className="icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
  								<path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
							</svg>
						</div>
						<div className="countSourceCard"></div>
						<div className="countProgCard"></div>
						<div className="countKnight"></div>
						<div className="countBridge"></div>
					</div>
					<div className="player player2">
						<div className="icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
  								<path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
							</svg>
						</div>
						<div className="countSourceCard"></div>
						<div className="countProgCard"></div>
						<div className="countKnight"></div>
						<div className="countBridge"></div>
					</div>
					<div className="player player3">
						<div className="icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
  								<path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
							</svg>
						</div>
						<div className="countSourceCard"></div>
						<div className="countProgCard"></div>
						<div className="countKnight"></div>
						<div className="countBridge"></div>
					</div>
				</div>
				<div className="player myProfile">
					<div className="icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
  							<path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
						</svg>
					</div>
					<div className="countSourceCard"></div>
					<div className="countProgCard"></div>
					<div className="countKnight"></div>
					<div className="countBridge"></div>
				</div>
			</section>
		</main>
	);
};

export default Home;