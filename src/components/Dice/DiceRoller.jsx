// 주사위 굴리기 UI 및 애니메이션을 처리하는 컴포넌트입니다.
import React, { useState, useEffect } from "react";
import useGameStore from "../../features/state/gameStore";
import "../../styles/DiceRoller.css";

import diceOne   from "../../assets/dice/diceOne.png";
import diceTwo   from "../../assets/dice/diceTwo.png";
import diceThree from "../../assets/dice/diceThree.png";
import diceFour  from "../../assets/dice/diceFour.png";
import diceFive  from "../../assets/dice/diceFive.png";
import diceSix   from "../../assets/dice/diceSix.png";

const DICE_IMAGES = [null, diceOne, diceTwo, diceThree, diceFour, diceFive, diceSix];

export default function DiceRoller() {
    const dice1 = useGameStore((state) => state.dice1);
    const dice2 = useGameStore((state) => state.dice2);

    const [visible, setVisible] = useState(false);
    const [dropped, setDropped] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        console.log("dice1:", dice1, "dice2:", dice2);
        if (!dice1 || !dice2) return;

        //초기화
        setVisible(true);
        setDropped(false);
        setShowResult(false);
        setFadeOut(false);

        //주사위 드롭
        const t1 = setTimeout(() => setDropped(true), 100);
        //결과 텍스트
        const t2= setTimeout(() => setShowResult(true), 1000);
        //페이드아웃
        const t3 = setTimeout(() => setFadeOut(true), 2500);
        //완전히 숨김
        const t4 = setTimeout(() => {
            setVisible(false);
            setDropped(false);
            setShowResult(false);
            setFadeOut(false);
        }, 3000);

        return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }, [dice1, dice2]);

    if (!visible) return null;

    return (
        <div className={`diceOverlay${fadeOut ? " fadeOut" : ""}`}>
            <div className="diceWrap">
                <img src={DICE_IMAGES[dice1]} alt={`주사위 ${dice1}`} className={`diceImg${dropped ? " drop" : ""}`} />
                <img src={DICE_IMAGES[dice2]} alt={`주사위 ${dice2}`} className={`diceImg${dropped ? " drop2" : ""}`} />
            </div>

            {/* 결과 */}
            <div className={`diceResult${showResult ? " show" : ""}`}>
                {dice1} + {dice2} = {dice1 + dice2}
            </div>
        </div>
    );
    
}