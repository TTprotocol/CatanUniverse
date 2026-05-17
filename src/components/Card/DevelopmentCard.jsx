import React from "react";
import knightImg from "@/assets/progCard/progressiveCard-knight.png";
import monopolyImg from "@/assets/progCard/progressiveCard-monopoly.png";
import roadBuildImg from "@/assets/progCard/progressiveCard-roadBuilding.png";
import victoryImg from "@/assets/progCard/progressiveCard-score.png";
import yearOfPlentyImg from "@/assets/progCard/progressiveCard-yearOfPlenty.png";

function DevelopmentCard({ type, count, size, onClick, className }) {
  const cardInfo = {
    knight: { name: "기사", image: knightImg },
    victoryPoint: { name: "승점", image: victoryImg },
    roadBuilding: { name: "도로 건설", image: roadBuildImg },
    yearOfPlenty: { name: "자원 발견", image: yearOfPlentyImg },
    monopoly: { name: "독점", image: monopolyImg },
  };

  const sizeConfig = {
    small: {width:40, height:50},
    medium: {width:55, height:80},
  };


  const resource = cardInfo[type];
  const CardSize = sizeConfig[size] || sizeConfig.medium;

  if (!resource) return null;

  return (
    <div
      className={`resourceCard ${className || ""}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <img
        src={resource.image}
        alt={resource.name}
        width={CardSize.width}
        height={CardSize.height}
        style={{ display: "block" }}
      />
      {count >= 0 && (
        <div className="countBadge">
          {count}
        </div>
      )}
    </div>
  );
}

export default DevelopmentCard;