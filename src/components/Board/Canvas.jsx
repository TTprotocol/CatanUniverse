import React, { useRef, useEffect, useState } from "react";
import useGameStore, { pinManagement } from "@/features/state/gameStore";
import {
	RESOURCE_TYPE,
	DEFAULT_TILES,
	CORNER_PIN,
	EDGE_PIN,
	TILE_PIN,
} from "@/utils/constants";
import mapImage from "@/assets/map/catanUniverse.png";
import robberImg from "@/assets/theif1.png";

// 플레이어별 이미지 import
import blueVillage from "@/assets/playerBlue/blueVillage.png";
import blueCity from "@/assets/playerBlue/blueCity.png";
import blueRoad from "@/assets/playerBlue/blueRoad.png";

import whiteVillage from "@/assets/playerWhite/whiteVillage.png";
import whiteCity from "@/assets/playerWhite/whiteCity.png";
import whiteRoad from "@/assets/playerWhite/whiteRoad.png";

import orangeVillage from "@/assets/playerOrange/orangeVillage.png";
import orangeCity from "@/assets/playerOrange/orangeCity.png";
import orangeRoad from "@/assets/playerOrange/orangeRoad.png";

import pinkVillage from "@/assets/playerPink/pinkVillage.png";
import pinkCity from "@/assets/playerPink/pinkCity.png";
import pinkRoad from "@/assets/playerPink/pinkRoad.png";

// console.log("CORNER_PIN : ", CORNER_PIN);

const playerImages = {
	1: { village: blueVillage, city: blueCity, road: blueRoad },
	2: { village: pinkVillage, city: pinkCity, road: pinkRoad },
	3: { village: orangeVillage, city: orangeCity, road: orangeRoad },
	4: { village: whiteVillage, city: whiteCity, road: whiteRoad },
};

function GameBoard({
	visibleCorners = [],
	visibleEdges = [],
	visibleTiles = [],
	setVisibleCorners = () => {}, // 수정 의도: 부모의 코너 핀 상태 setter를 받아 건설 직후 핀 표시를 해제합니다.
	setVisibleEdges = () => {}, // 수정 의도: 부모의 엣지 핀 상태 setter를 받아 도로 건설 직후 핀 표시를 해제합니다.
	setVisibleTiles = () => {},
}) {
	const canvasRef = useRef(null);
	const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

	const cornerPinMap = Object.fromEntries(CORNER_PIN.map((p) => [p.id, p]));
	const edgePinMap = Object.fromEntries(EDGE_PIN.map((p) => [p.id, p]));

	// 현재 플레이어 정보, 보드 상태, 현재 턴 인덱스를 가져옴
	const {
		board,
		currentPlayerIndex,
		moveRobber,
		buildRoads,
		buildSettlement,
		buildCity,
	} = useGameStore.getState();
	const players = useGameStore((state) => state.players);

	// 현재 사용되고 있는 핀들을 관리함.
	const {
		setCornerPin,
		setEdgePin,
		setRobber,
		getCornerPins,
		getEdgePins,
		getRobber,
	} = pinManagement.getState();

	const robberTile = useGameStore((state) => state.board.robber);

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
						const isUsedCorner = getCornerPins(pin.id);

						const buildResult = isUsedCorner
							? buildCity(pin.id)
							: buildSettlement(pin.id);

						console.log(
							`건설 처리: ${pin.id}, ${
								isUsedCorner ? "도시 업그레이드" : "정착지 건설"
							}, 결과: ${buildResult?.message ?? "알 수 없음"}`,
						);

						if (buildResult?.result) setVisibleCorners([]); // 건설이 성공한 경우에만 visibleCorners를 비워 핀을 숨김
					}}
				/>
			))}

			{/* 건설된 정착지 */}
			{players.map((player) =>
				player.settlements.map((pinId) => {
					const pin = cornerPinMap[pinId];
					if (!pin) return null;

					return (
						<img
							key={`settlement-${player.id}-${pinId}`}
							src={playerImages[player.id]?.village || blueVillage}
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
				}),
			)}

			{/* 건설된 도시 */}
			{players.map((player) =>
				player.cities.map((pinId) => {
					const pin = cornerPinMap[pinId];
					if (!pin) return null;

					return (
						<img
							key={`city-${player.id}-${pinId}`}
							src={playerImages[player.id]?.city || blueCity}
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
				}),
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
						const buildResult = buildRoads(pin.id);

						console.log(
							`건설 처리: ${pin.id}, "도로 건설, 결과: ${buildResult?.message ?? "알 수 없음"}`,
						);

						console.log("buildResult : ", buildResult?.result);

						if (buildResult?.result) setVisibleEdges([]); // 건설이 성공한 경우에만 visibleEdge를 비워 핀을 숨김
					}}
				/>
			))}

			{/* 건설된 도로 */}
			{players.map((player) =>
				player.roads.map((pinId) => {
					const pin = edgePinMap[pinId];
					if (!pin) return null;

					return (
						<img
							key={`road-${player.id}-${pinId}`}
							src={playerImages[player.id]?.road || blueRoad}
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
				}),
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
						const moveRobber = moveRobber(pin.id);

						console.log(
							`이동 처리: ${pin.id}, "도둑 이동, 결과: ${buildResult?.message ?? "알 수 없음"}`,
						);

						console.log("moveRobber : ", moveRobber?.result);

						if (moveRobber?.result) setVisibleTiles([]); // 건설이 성공한 경우에만 visibleEdge를 비워 핀을 숨김
					}}
				/>
			))}

			{TILE_PIN.map(
				(pin) =>
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
					),
			)}
		</div>
	);
}

export default GameBoard;
