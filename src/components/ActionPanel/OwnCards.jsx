import React from "react";

export default function OwnCards() {
    return (
        <div className="ownCards">
            <div className="ownResourceCard">
                {/* {Object.entries(resourceCards).map(([type, count]) =>
                    count > 0 ? (
                        <ResourceCard Key={type} type={type} count={count}/>
                    ) : null
                )} */}
            </div>
            <div className="ownDevelopmentCard">
                {/* {Object.entries(developmentCards).map(([type, count]) =>
                    count > 0 ? (
                        <developmentCard Key={type} type={type} count={count}/>
                    ) : null
                )} */}
            </div>
        </div>
    );
}
