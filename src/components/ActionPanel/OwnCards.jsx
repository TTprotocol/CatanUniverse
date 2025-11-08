import React from "react";
import ResourceCard from "../Card/ResourceCard";
import DevelopmentCard from "../Card/DevelopmentCard";

export default function OwnCards({ players = [] }) {

    const me = Array.isArray(players) && players.length > 0 ? players[0] : null;
    if (!me) return null;

    const RESOURCE_TYPES = ["tree", "brick", "sheep", "wheat", "steel"];
    const DEV_CARD_TYPES = ["knight","victoryPoint","roadBuilding","yearOfPlenty","monopoly"];

    console.log("OwnCards me:", me);
    return (
        <div className="ownCards">
            <div className="ownResourceCard">
                {me.resources.map((count, index) =>
                    count > 0 ? (
                        <ResourceCard key={RESOURCE_TYPES[index]} type={RESOURCE_TYPES[index]} count={count} />
                    ) : null
                )}
            </div>
            <div className="ownDevelopmentCard">
                {me.devCards.map((count, index) =>
                    count > 0 ? (
                        <DevelopmentCard key={DEV_CARD_TYPES[index]} type={DEV_CARD_TYPES[index]} count={count} />
                    ) : null
                )}
            </div>
        </div>
    );
}