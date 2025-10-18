import React from "react";
import ResourceCard from "../Card/ResourceCard";
import DevelopmentCard from "../Card/DevelopmentCard";

export default function OwnCards({ cards = [] }) {

    const resourceCards = cards.filter(c => c.category ==='resource');
    const developmentCards = cards.filter(c => c.category ==='development');

    return (
        <div className="ownCards">
            <div className="ownResourceCard">
                {resourceCards.map(({ type, count }) =>
                    count > 0 ? (
                        <ResourceCard key={type} type={type} count={count}/>
                    ) : null
                )}
            </div>
            <div className="ownDevelopmentCard">
                {developmentCards.map(({ type, count }) =>
                    count > 0 ? (
                        <DevelopmentCard key={type} type={type} count={count}/>
                    ) : null
                )}
            </div>
        </div>
    );
}
