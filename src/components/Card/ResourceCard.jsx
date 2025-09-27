import React from "react";
import treeImg from "@/assets/resourceCard/resourceCardTree.png";
import brickImg from "@/assets/resourceCard/resourceCardBrick.png";
import sheepImg from "@/assets/resourceCard/resourceCardSheep.png";
import wheatImg from "@/assets/resourceCard/resourceCardWheat.png";
import steelImg from "@/assets/resourceCard/resourceCardSteel.png";

function ResourceCard({ type, count }) {
  const cardInfo = {
    tree: { name: "나무", image: treeImg },
    brick: { name: "벽돌", image: brickImg },
    sheep: { name: "양", image: sheepImg },
    wheat: { name: "밀", image: wheatImg },
    steel: { name: "철", image: steelImg },
  };

  const resource = cardInfo[type];

  return (
    <div className="resourceCard">
      <img
        src={resource.image}
        alt={resource.name}
        width="40"
        height="50"
        style={{ display: "block" }}
      />
      {count > 1 && (
        <div className="countBadge">
          {count}
        </div>
      )}
    </div>
  );
}

export default ResourceCard;