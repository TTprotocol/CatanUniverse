import React from "react";
import ResourceCard from "../Card/ResourceCard";
import DevelopmentCard from "../Card/DevelopmentCard";

export default function OwnCards({ resourceCards, developmentCards }) {
    return (
        <div className="ownCards">
            <div className="ownResourceCard">
                {Object.entries(resourceCards).map(([type, count]) =>
                    count > 0 ? (
                        <ResourceCard key={type} type={type} count={count}/>
                    ) : null
                )}
            </div>
            <div className="ownDevelopmentCard">
                {Object.entries(developmentCards).map(([type, count]) =>
                    count > 0 ? (
                        <DevelopmentCard key={type} type={type} count={count}/>
                    ) : null
                )}
            </div>
        </div>
    );
}
