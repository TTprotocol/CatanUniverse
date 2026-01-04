import React, { useRef, useEffect, useState } from "react";
import useGameStore from "@/features/state/gamestore";
import { useBuildActions } from "@/features/game/actionHandler";
import {
	RESOURCE_TYPE,
	DEFAULT_TILES,
	CORNER_PIN,
	EDGE_PIN,
	TILE_PIN,
} from "@/utils/constants";
import mapImage from "../../assets/map/catanUniverse.jpg";
import settlementImg from "@/assets/playerBlue/blueVillage.png";
import cityImg from "@/assets/playerBlue/blueCity.png";
import roadImg from "@/assets/playerBlue/blueRoad.png";
import robberImg from "@/assets/theif1.png";

// console.log("CORNER_PIN : ", CORNER_PIN);

function GameBoard({
	visibleCorners = [],
	visibleEdges = [],
	visibleTiles = [],
}) {
	const canvasRef = useRef(null);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

	const cornerPinMap = Object.fromEntries(CORNER_PIN.map(p => [p.id, p]));
	const edgePinMap = Object.fromEntries(EDGE_PIN.map(p => [p.id, p]));

	//현재 플레이어 정보, 보드 상태, 현재 턴 인덱스를 가져옴
	const { board, currentPlayerIndex, buildSettlement, buildCity } =
		useGameStore.getState();
	// const { buildSettlement, upgradeToCity } = useBuildActions();
	const { players } = useGameStore.getState(state => state.players);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const img = new Image();

		img.src = mapImage;
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			setCanvasSize({ width: img.width, height: img.height });
		};
	}, []);

	const robberTile = useGameStore(state => state.board.robber);

	return (
		<div
			style={{
				position: "relative",
				width: canvasSize.width,
				height: canvasSize.height,
			}}
		>
			<canvas ref={canvasRef} />

			{CORNER_PIN.map((pin) => (
				<button
					key={`corner-${pin.id}`}
					style={{
						position: "absolute",
						top: pin.y,
						left: pin.x,
						transform: "translate(-50%, -50%)",
						background: "#eee",
						borderRadius: "50%",
						width: "30px",
						height: "30px",
						border: "3px solid #555",
						cursor: "pointer",
						opacity: "70%",
						display: visibleCorners.includes(pin.id) ? "block" : "none",
						zIndex: 3,
						// display: "block",
					}}
					onClick={() => {
						alert(`마을/도시 건설: ${pin.id}`);
					}}
				/>
			))}

			{/* 건설된 정착지 */}
			{players.map(player =>
				player.settlements.map(pinId => {
					const pin = cornerPinMap[pinId];
					if (!pin) return null;

					return (
						<img
							key={`settlement-${player.id}-${pinId}`}
							src={settlementImg}
							alt="정착지"
							style={{
								position: "absolute",
								top: pin.y,
								left: pin.x,
								transform: "translate(-50%, -50%)",
								width: "50px",
								height: "50px",
								zIndex: 2,
								pointerEvents: "none",
							}}
            			/>
					);
				})
			)}

			{/* 건설된 도시 */}
			{players.map(player =>
				player.cities.map(pinId => {
					const pin = cornerPinMap[pinId];
					if (!pin) return null;

					return (
						<img
							key={`city-${player.id}-${pinId}`}
							src={cityImg}
							alt="도시"
							style={{
								position: "absolute",
								top: pin.y,
								left: pin.x,
								transform: "translate(-50%, -50%)",
								width: "50px",
								height: "50px",
								zIndex: 6,
								pointerEvents: "none",
							}}
						/>
					);
				})
			)}

			{EDGE_PIN.map((pin) => (
				<button
					key={`edge-${pin.id}`}
					style={{
						position: "absolute",
						top: pin.y,
						left: pin.x,
						transform: "translate(-50%, -50%)",
						background: "#eee",
						borderRadius: "50%",
						width: "30px",
						height: "30px",
						border: "3px solid #555",
						cursor: "pointer",
						opacity: "70%",
						display: visibleEdges.includes(pin.id) ? "block" : "none",
						zIndex: 3,
					}}
					onClick={() => {
						alert(`도로 건설: ${pin.id}`);
					}}
				/>
			))}

			{/* 건설된 도로 */}
			{players.map(player =>
				player.roads.map(pinId => {
					const pin = edgePinMap[pinId];
					if (!pin) return null;

					return (
						<img
							key={`road-${player.id}-${pinId}`}
							src={roadImg}
							alt="도로"
							style={{
								position: "absolute",
								top: pin.y,
								left: pin.x,
								transform: `translate(-50%, -50%) rotate(${pin.angle}deg)`,
								width: "35px",
								height: "70px",
								zIndex: 1,
								pointerEvents: "none",
							}}
						/>
					);
				})
			)}

			{TILE_PIN.map((pin) => (
				<button
					key={`tile-${pin.id}`}
					style={{
						position: "absolute",
						top: pin.y,
						left: pin.x,
						transform: "translate(-50%, -50%)",
						background: "#eee",
						borderRadius: "50%",
						width: "50px",
						height: "50px",
						border: "3px solid #555",
						cursor: "pointer",
						opacity: "70%",
						display: visibleTiles.includes(pin.id) ? "block" : "none",
						zIndex: 3,
					}}
					onClick={() => {
						alert(`도둑 옮기기: ${pin.id}`);
					}}
				/>
			))}

			{TILE_PIN.map((pin) => (
				pin.id === robberTile && (
					<img
						key="robber"
						src={robberImg}
						alt="도둑"
						style={{
							position: "absolute",
							top: pin.y,
							left: pin.x,
							transform: "translate(-50%, -50%)",
							width: "50px",
							height: "60px",
							zIndex: 7,
							pointerEvents: "none",
						}}
					/>
				)
			))}
		</div>
	);
}

export default GameBoard;

// // 정착지, 도시를 건설하는 핀
// const cornerPin = [
// 	[340, 135],
// 	[455, 135],
// 	[575, 135],
// 	[280, 165],
// 	[398, 165],
// 	[515, 165],
// 	[625, 165],
// 	[280, 230],
// 	[398, 230],
// 	[515, 230],
// 	[625, 230],
// 	[228, 260],
// 	[340, 260],
// 	[455, 260],
// 	[575, 260],
// 	[685, 260],
// 	[228, 335],
// 	[340, 335],
// 	[455, 335],
// 	[575, 335],
// 	[685, 335],
// 	[170, 360],
// 	[280, 360],
// 	[398, 360],
// 	[515, 360],
// 	[625, 360],
// 	[740, 360],
// 	[170, 430],
// 	[280, 430],
// 	[398, 430],
// 	[515, 430],
// 	[625, 430],
// 	[740, 430],
// 	[228, 460],
// 	[340, 460],
// 	[455, 460],
// 	[575, 460],
// 	[685, 460],
// 	[228, 525],
// 	[340, 525],
// 	[455, 525],
// 	[575, 525],
// 	[685, 525],
// 	[280, 560],
// 	[398, 560],
// 	[515, 560],
// 	[625, 560],
// 	[280, 625],
// 	[398, 625],
// 	[515, 625],
// 	[625, 625],
// 	[340, 660],
// 	[455, 660],
// 	[575, 660],
// ].map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));

// // 도로를 건설하는 핀
// const edgePin = [
// 	[310, 150],
// 	[370, 150],
// 	[425, 150],
// 	[485, 150],
// 	[545, 150],
// 	[600, 150],
// 	[280, 195],
// 	[398, 195],
// 	[515, 195],
// 	[625, 195],
// 	[254, 245],
// 	[310, 245],
// 	[370, 245],
// 	[425, 245],
// 	[485, 245],
// 	[545, 245],
// 	[600, 245],
// 	[655, 245],
// 	[228, 295],
// 	[340, 295],
// 	[455, 295],
// 	[575, 295],
// 	[685, 295],
// 	[198, 345],
// 	[254, 345],
// 	[310, 345],
// 	[370, 345],
// 	[425, 345],
// 	[485, 345],
// 	[545, 345],
// 	[600, 345],
// 	[655, 345],
// 	[715, 345],
// 	[170, 395],
// 	[280, 395],
// 	[398, 395],
// 	[515, 395],
// 	[625, 395],
// 	[740, 395],
// 	[198, 445],
// 	[254, 445],
// 	[310, 445],
// 	[370, 445],
// 	[425, 445],
// 	[485, 445],
// 	[545, 445],
// 	[600, 445],
// 	[655, 445],
// 	[715, 445],
// 	[228, 494],
// 	[340, 494],
// 	[455, 494],
// 	[575, 494],
// 	[685, 494],
// 	[254, 545],
// 	[310, 545],
// 	[370, 545],
// 	[425, 545],
// 	[485, 545],
// 	[545, 545],
// 	[600, 545],
// 	[655, 545],
// 	[280, 593],
// 	[398, 593],
// 	[515, 593],
// 	[625, 593],
// 	[310, 645],
// 	[370, 645],
// 	[425, 645],
// 	[485, 645],
// 	[545, 645],
// 	[600, 645],
// ].map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));

// // 타일을 클릭하는 핀 (도둑 이동용)
// const tilePin = [
// 	[340, 200],
// 	[455, 200],
// 	[575, 200],
// 	[280, 300],
// 	[398, 300],
// 	[515, 300],
// 	[625, 300],
// 	[228, 400],
// 	[340, 400],
// 	[455, 400],
// 	[575, 400],
// 	[685, 400],
// 	[280, 500],
// 	[398, 500],
// 	[515, 500],
// 	[625, 500],
// 	[340, 600],
// 	[455, 600],
// 	[575, 600],
// ].map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));
