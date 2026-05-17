import React, { useState } from "react";
import useGameStore from "../../features/state/gameStore";
import "../../styles/DevCardUsePanel.css";

const RES_NAME = ["나무", "벽돌", "양", "밀", "철"];
const CARD_NAME = ["기사", "승점", "도로 건설", "자원 발견", "독점"];

export default function DevCardUsePanel({ cardIndex, onClose }) {
	const useDevCard = useGameStore((s) => s.useDevCard);
	const [selectedRes, setSelectedRes] = useState([]);

	const handleUse = () => {
		let extra = null;
		if (cardIndex === 3) {
			if (selectedRes.length !== 2) { alert("자원을 2개 선택하세요."); return; }
			extra = selectedRes;
		} else if (cardIndex === 4) {
			if (selectedRes.length !== 1) { alert("독점할 자원을 1개 선택하세요."); return; }
			extra = selectedRes[0];
		}
		const result = useDevCard(cardIndex, extra);
		if (!result.result) { alert(result.message); return; }
		onClose();
	};

	const toggleRes = (idx) => {
		if (cardIndex === 3) {
			setSelectedRes((prev) =>
				prev.includes(idx)
					? prev.filter((r) => r !== idx)
					: prev.length < 2 ? [...prev, idx] : prev
			);
		} else if (cardIndex === 4) {
			setSelectedRes([idx]);
		}
	};

	return (
		<div className="devCardUsePanel">
			<p className="devCardUsePanel__title">
				<strong>{CARD_NAME[cardIndex]}</strong> 카드를 사용하시겠습니까?
			</p>

			{cardIndex === 0 && (
				<p className="devCardUsePanel__desc">도둑을 이동합니다.</p>
			)}
			{cardIndex === 2 && (
				<p className="devCardUsePanel__desc">도로 2개를 무료로 건설합니다.</p>
			)}

			{(cardIndex === 3 || cardIndex === 4) && (
				<div className="devCardUsePanel__resList">
					{RES_NAME.map((name, idx) => (
						<button
							key={idx}
							className={`devCardUsePanel__resBtn ${selectedRes.includes(idx) ? "selected" : ""}`}
							onClick={() => toggleRes(idx)}
						>
							{name}
						</button>
					))}
				</div>
			)}

			<div className="devCardUsePanel__actions">
				<button className="devCardUsePanel__btnUse" onClick={handleUse}>사용</button>
				<button className="devCardUsePanel__btnCancel" onClick={onClose}>취소</button>
			</div>
		</div>
	);
}