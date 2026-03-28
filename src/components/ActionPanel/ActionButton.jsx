import React from "react";
import useGameStore from '../../features/state/gameStore';

export default function ActionButton({ className, onClick, children }) {
  const {players, currentPlayerIndex} = useGameStore();
  
  //자원 배열 형태 가정 : [나무(0), 벽돌(1), 양(2), 밀(3), 철(4)]
  const currentResources = players[currentPlayerIndex]?.resources || [0, 0, 0, 0, 0];
  const [wood, brick, sheep, wheat, steel] = currentResources;

  let isActionAllowed = true;

  if(className.includes('buildRoad')) {
    isActionAllowed = wood >= 1 && brick >= 1;
  } else if(className.includes('buildVillage')) {
    isActionAllowed = wood >= 1 && brick >= 1 && sheep >= 1 && wheat >= 1;
  } else if (className.includes('buildCity')) {
    isActionAllowed = wheat >= 2 && steel >= 3;
  } else if(className.includes('development')) {
    isActionAllowed = sheep >= 1 && wheat >= 1 && steel >= 1;
  }

  const statusClass = isActionAllowed ? 'highlight' : 'disabled';

  //각 액션별 자원 충족 여부 계산
  const canBuildRoad = wood >= 1 && brick >= 1;
  const canBuildVillage = wood >= 1 && brick >= 1 && sheep >= 1 && wheat >= 1;
  const canBuildCity = wheat >= 2 && steel >= 3;
  const canBuyDevCard = sheep >= 1 && wheat >= 1 && steel >= 1;

  const canTrade = true;

  return (
    <button 
      className={`action-btn ${className} ${statusClass}`} 
      onClick={isActionAllowed ? onClick : undefined}
      disabled={!isActionAllowed}
    >
      {children}
    </button>
  );
}