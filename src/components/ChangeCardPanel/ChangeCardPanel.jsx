import React, { useState } from "react";
import TradeCardSection from "./TradeCardSection";
import useGameStore from "../../features/state/gameStore";

const RES = ["tree", "brick", "sheep", "wheat", "steel"];

// AI가 제안을 수락할지 판단 (단순 로직: 요청 자원 보유 여부)
function aiDecideAccept(aiPlayer, offer, request) {
    for (const [type, amt] of Object.entries(request || {})) {
        const idx = RES.indexOf(type);
        if ((aiPlayer.resources[idx] || 0) < amt) return false;
    }
    return true;
}

// phase: "SELECT" → "OFFERING" → "ACCEPTED" | "BANK"
export default function ChangeCardPanel() {
    const players = useGameStore((state) => state.players);
    const currentPlayerIndex = useGameStore((state) => state.currentPlayerIndex);
    const tradeBetweenPlayers = useGameStore((state) => state.tradeBetweenPlayers);
    const tradeWithBank = useGameStore((state) => state.tradeWithBank);
    const currentPlayer = players[currentPlayerIndex] ?? null;

    // 자원 선택 상태
    const [selectedGive, setSelectedGive] = useState([]);
    const [selectedReceive, setSelectedReceive] = useState([]);

    // phase 상태머신
    const [phase, setPhase] = useState("SELECT"); // SELECT | OFFERING | ACCEPTED | BANK
    const [offerResults, setOfferResults] = useState([]); // [{name, accepted}]
    const [acceptedPlayer, setAcceptedPlayer] = useState(null);
    const [acceptedPlayers, setAcceptedPlayers] = useState([]); // 수락자 목록

    // ── 자원 선택 핸들러 ──
    const handleClick = (resourceType, context) => {
        if (phase !== "SELECT" && phase !== "BANK") return;
        if (context === "receive") {
            setSelectedReceive((prev) => [...prev, resourceType]);
        } else {
            setSelectedGive((prev) => [...prev, resourceType]);
        }
    };

    const handleReset = (context) => {
        if (phase !== "SELECT" && phase !== "BANK") return;
        if (context === "receive") setSelectedReceive([]);
        else setSelectedGive([]);
    };

    const handleChoose = (acceptor) => {
        tradeBetweenPlayers(currentPlayer.id, acceptor.id, giveCounts, receiveCounts);
        setAcceptedPlayer(acceptor);
        setAcceptedPlayers([]);
        setPhase("ACCEPTED");
    };

    const handleRemove = (resourceType, type) => {
        if(type === 'receive') {
            setSelectedReceive(prev => {
                const index = prev.lastIndexOf(resourceType); 
                if(index > -1) {
                    const newArr = [...prev];
                    newArr.splice(index, 1);
                    return newArr;
                }
                return prev;;
            })
        } else {
            setSelectedGive(prev => {
                const index = prev.lastIndexOf(resourceType);
                if(index > -1) {
                    const newArr = [...prev];
                    newArr.splice(index, 1);
                    return newArr;
                }
                return prev;
            });
        }
    }
    // ── 초기화 ──
    const reset = () => {
        setSelectedGive([]);
        setSelectedReceive([]);
        setPhase("SELECT");
        setOfferResults([]);
        setAcceptedPlayer(null);
        setAcceptedPlayers([]);
    };

    // ── offer 집계 ──
    const toCountMap = (arr) =>
        arr.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {});

    const giveCounts = toCountMap(selectedGive);
    const receiveCounts = toCountMap(selectedReceive);

    // ── 제안 제출: 다른 플레이어에게 교환 제안 ──
    const handleOffer = () => {
        if (!currentPlayer) return;

        const giveTypes = [...new Set(selectedGive)];
        if (giveTypes.length !== 1) { alert("내놓을 자원은 같은 종류만 선택하세요."); return; }
        //if (selectedReceive.length !== 1) { alert("받을 자원을 1종류 선택하세요."); return; }
        if (giveTypes[0] === selectedReceive[0]) { alert("같은 자원끼리는 교환할 수 없습니다."); return; }

        // 내가 give 자원을 실제로 보유하는지 확인
        const giveIdx = RES.indexOf(giveTypes[0]);
        if ((currentPlayer.resources[giveIdx] || 0) < selectedGive.length) {
            alert("내놓을 자원이 부족합니다.");
            return;
        }

        setPhase("OFFERING");

        // 나를 제외한 다른 플레이어에게 제안
        const others = players.filter((p) => p.id !== currentPlayer.id);
        const offer = giveCounts;
        const request = receiveCounts;

        const results = others.map((p) => ({
            id: p.id,
            name: p.name,
            accepted: aiDecideAccept(p, offer, request),
        }));

        setOfferResults(results);

        const acceptors = results.filter((r) => r.accepted);

        if (acceptors.length > 0) {
            setAcceptedPlayers(acceptors); // 목록 저장
            setPhase("CHOOSE"); // 선택 phase로
        } else {
            // 모두 거절 → 은행 교환 단계로
            setPhase("BANK");
        }
    };

    // ── 은행 교환 실행 ──
    const handleBankTrade = () => {
        if (!currentPlayer) return;

        const giveType = [...new Set(selectedGive)][0];
        const receiveType = selectedReceive[0];

        let rate = 4;
        if (currentPlayer.ports?.includes(giveType)) rate = 2;
        else if (currentPlayer.ports?.includes("any")) rate = 3;

        if (selectedGive.length < rate) {
            alert(`은행 교환: ${giveType}은 ${rate}개 이상 필요합니다. (현재 ${selectedGive.length}개)`);
            return;
        }

        tradeWithBank(currentPlayer.id, giveType, receiveType);
        reset();
    };

    // ── 렌더 ──
    return (
        <div className="changeCardPanel">
            <div>
                <div className="tradeCard">
                    
                    {/* ── SELECT / OFFERING / ACCEPTED / BANK 공통: 자원 선택 UI ── */}
                    <TradeCardSection
                        type="receive"
                        uniqueResources={[...new Set(selectedReceive)]}
                        resourceCounts={receiveCounts}
                        handleClick={handleClick}
                        handleRemove={handleRemove}
                        handleReset={handleReset}
                    />
                    <TradeCardSection
                        type="give"
                        uniqueResources={[...new Set(selectedGive)]}
                        resourceCounts={giveCounts}
                        handleClick={handleClick}
                        handleRemove={handleRemove}
                        handleReset={handleReset}
                    />
                </div>
            </div>
        <div className="tradeStatusArea" style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            zIndex: 10,
            borderRadius: '8px',
            width: '100%',
            marginBottom: '10px',
        }}>
        {/* ── phase별 안내 메시지 ── */}
        {phase === "OFFERING" && (
            <div style={styles.msg}>⏳ 제안 중.........</div>
        )}
        {phase === "CHOOSE" && (
            <div style={{ padding: "15px", backgroundColor: '#f8f9fa', borderRadius: '8px'}}>
                <div style={{ fontSize: "12px", fontWeight: "bold", color: '#333', whiteSpace: "nowrap", marginBottom: '12px'}}>
                    🤝 교환할 플레이어를 선택하세요
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {acceptedPlayers.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleChoose(p)}
                            style={styles.chooseBtn}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>
        )}
        {phase === "ACCEPTED" && (
            <div style={{...styles.msg, color: "#2a7a2a", backgroundColor: '#f8f9fa'}}>
                ✅ {acceptedPlayer?.name}이(가) 수락했습니다!
            </div>
        )}
        {phase === "BANK" && (
            <div style={{...styles.msg, color: "#b05a00", backgroundColor: '#f8f9fa'}}>
                ❌ 모두 거절했습니다. 은행과 교환하세요.
            </div>
        )}

        {/* ── 플레이어별 결과 ── */}
        {(phase === "ACCEPTED" || phase === "BANK") && offerResults.length > 0 && (
            <div style={styles.results}>
                {offerResults.map((r) => (
                    <span key={r.id} style={r.accepted ? styles.accept : styles.reject}>
                        {r.name}: {r.accepted ? "✅" : "❌"}
                    </span>
                ))}
            </div>
        )}
        </div>
            {/* ── 버튼 영역 ── */}
            {(phase === "SELECT" || phase === "BANK") && (
                <button className="changeCardSubmit" onClick={handleOffer} title="플레이어에게 재제안">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6-1">
                        <path fillRule="evenodd" d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                </button>
            )}

            {phase === "BANK" && (
                <button
                    className="changeCardSubmit"
                    onClick={handleBankTrade}
                    title="은행과 교환"
                    style={{ backgroundColor: "#e8f0ff", marginTop: "60px" }}
                >
                    🏦
                </button>
            )}

            {(phase === "ACCEPTED" || phase === "BANK") && (
                <button onClick={reset} style={styles.resetBtn} title="취소">✕</button>
            )}
        </div>
    );
}

const styles = {
    msg: {
        fontSize: "12px",
        padding: "10px 20px",
        fontWeight: "bold",
        backgroundColor: 'white',
        textAlign: 'center',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
    },
    results: {
        display: "flex",
        gap: "15px",
        padding: "10px 15px",
        fontSize: "11px",
        backgroundColor : 'white',
        justifyContent: 'center',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
    },
    accept: { color: "#2a7a2a" },
    reject: { color: "#999" },
    resetBtn: {
        position: "absolute",
        bottom: "60px",
        right: "-60px",
        width: "50px",
        height: "50px",
        background: "#fff",
        boxShadow: "0 0 9px rgba(0,0,0,0.5)",
        fontSize: "18px",
        cursor: "pointer",
        border: "none",
        borderRadius: "4px",
    },
    chooseBtn: {
        padding: "2px 10px",
        borderRadius: "6px",
        border: "1px solid #1369a8",
        backgroundColor: "#e8f0ff",
        color: "#1369a8",
        fontWeight: "bold",
        fontSize: "12px",
        cursor: "pointer",
    },
};