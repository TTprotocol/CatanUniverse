import React from "react";
import treeImg from "@/assets/resourceCard/resourceCardTree.png";
import brickImg from "@/assets/resourceCard/resourceCardBrick.png";
import sheepImg from "@/assets/resourceCard/resourceCardSheep.png";
import wheatImg from "@/assets/resourceCard/resourceCardWheat.png";
import steelImg from "@/assets/resourceCard/resourceCardSteel.png";

function ResourceCard({ type, count, size }) {
  const cardInfo = {
    tree: { name: "나무", image: treeImg },
    brick: { name: "벽돌", image: brickImg },
    sheep: { name: "양", image: sheepImg },
    wheat: { name: "밀", image: wheatImg },
    steel: { name: "철", image: steelImg },
  };

  const sizeConfig = {
    small: {width:40, height:50},
    medium: {width:55, height:80},
  };

  const resource = cardInfo[type];
  const CardSize = sizeConfig[size] || sizeConfig.medium;

  if (!resource) return null;

  return (
    <div className={`resourceCard resourceCard--${size}`}>
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

export default ResourceCard;
