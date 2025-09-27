import React, {useState} from "react";
import TradeCardSection from "./TradeCardSection";

export default function ChangeCardPanel() {

    const [selectedReceiveResources, setSelectedReceiveResources] = useState([]);
	const [selectedGiveResources, setSelectedGiveResources] = useState([]);

	const handleClick = (resourceType, context) => {
		if (context === "receive") {
			setSelectedReceiveResources((prev) => [...prev, resourceType]);
		} else if (context === "give") {
			setSelectedGiveResources((prev) => [...prev, resourceType]);
		}
	};

	const handleReset = (context) => {
		if (context === "receive") {
			setSelectedReceiveResources([]);
		} else if (context === "give") {
			setSelectedGiveResources([]);
		}
	};

	// ReceiveCard용
	const receiveCounts = selectedReceiveResources.reduce((acc, type) => {
		acc[type] = (acc[type] || 0) + 1;
		return acc;
	}, {});

	const uniqueReceiveResources = [...new Set(selectedReceiveResources)];

	// GiveCard용
	const giveCounts = selectedGiveResources.reduce((acc, type) => {
		acc[type] = (acc[type] || 0) + 1;
		return acc;
	}, {});

	const uniqueGiveResources = [...new Set(selectedGiveResources)];

    return (
        <div className="changeCardPanel">
        <div>
            <div className="tradeCard">
            <TradeCardSection
                type="receive"
                uniqueResources={uniqueReceiveResources}
                resourceCounts={receiveCounts}
                handleClick={handleClick}
                handleReset={handleReset}
            />
            <TradeCardSection
                type="give"
                uniqueResources={uniqueGiveResources}
                resourceCounts={giveCounts}
                handleClick={handleClick}
                handleReset={handleReset}
            />
            </div>
        </div>
        <button className="changeCardSubmit">
            {/* 제출 버튼 SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6-1">
                <path fillRule="evenodd" d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
        </button>
        </div>
    );
}
