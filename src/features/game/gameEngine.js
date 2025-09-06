// 카탄 게임의 전체 흐름(턴 관리, 행동 가능 여부 등)을 제어하는 핵심 엔진입니다.

// - 지원 기능:
//   1) 턴 시작/종료
//   2) 60초 자동 턴 종료 타이머
//   3) 주사위 굴림 → 이후에만 건설/교환 가능 (간단한 phase 가드)
//   4) 로그 기록
//
// - 의존 데이터:
//   props로 받은 players: string[] 또는 {name: string}[] (둘 중 하나 사용 가능)
//   * string 배열이면 그대로 출력, 객체 배열이면 .name을 사용하여 로그에 표시합니다.
//
// - 확장 포인트(주석 검색 ▶ "확장 포인트"):
//   - rollDice 내부에서 자원 분배/도둑 처리/개발 카드 등 연결
//   - build / trade 내부에서 실제 비용 검증/상태 갱신 연결
//
// 사용 예:
// const { currentPlayer, diceRolled, rollDice, build, trade, endTurn, log } = useCatanTurnManage(players);

import {useState, useEffect, useRef, useCallback} from 'react';

export default function useCatanTurnManager(players) {
    //현재 턴 플레이어 인덱스(0부터 시작)
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    //이번 턴에 주사위를 이미 굴렸는지 여부(한 턴에 1회 제한)
    const [diceRolled, setDiceRolled] = useState(false);

    //60초 자동 종료 타이머 ref(값이 바뀌어도 리렌더 방지)
    const timerRef = useRef(null);

    //간단한 텍스트 로그
    const [log, setLog] = useState([]);

    //플레이어 표기(문자열 배열 / 객체 배열 모두 지원)
    const formatPlayer = useCallback((p) => {
        if(typeof p === 'string') return p;
        if( p && typeof p === 'object' && 'name' in p) return p.name;
        return String(p);
    }, []);

    //로그 추가
    const logAction = useCallback((text) => {
        setLog((prev) => [...prev, text]);
    }, []); 

    //턴 종료
    //auto=true 인 경우(시간 초과 등) 주사위 미굴림이어도 종료 허용
    const endTurn = useCallback((auto = false) => {

        //플레이어 없으면 종료 불필요

        if(!players || players.length === 0) return;

        //수동 종료인데 주사위를 안굴렸다면 제한
        if (!diceRolled && !auto) {
            logAction("주사위를 굴리기 전에는 턴을 종료할 수 없습니다.");
            return;
        }

        //타이머 정리
        if(timerRef.current) clearTimeout(timerRef.current);

        const player = players[currentPlayerIndex];
        logAction(`${formatPlayer(player)}의 턴 종료`);

        //다음 플레이어 인덱스로 순환 이동
        const nextIndex = (currentPlayerIndex + 1) % player.length;
        setCurrentPlayerIndex(nextIndex);
    }, [players, currentPlayerIndex, diceRolled, logAction, formatPlayer]);


    //턴 시작
    const startTurn = useCallback(() => {
        //방어 : 플레이어가 없으면 아무 것도 하지 않음

        if(!players || players.length === 0) return;
        const player = players[currentPlayerIndex];
        logAction(`${formatPlayer(player)}의 턴을 시작합니다.`);
        setDiceRolled(false); //턴 시작시 주사위 상태 초기화

        //60초 타이머 초기화 & 시작
        if(timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            logAction(`${formatPlayer(player)}의 시간 초과! 턴을 자동 종료합니다.`);
            endTurn(true); //auto=true: 주사위 전 종료 허용
        }, 60_000);
    }, [players, currentPlayerIndex, logAction, formatPlayer, endTurn]);

    
    // 주사위 굴리기
    const rollDice = useCallback(() => {
        //이미 굴렸으면 제한

        if(diceRolled) {
            logAction('이미 주사위를 굴렸습니다.');
            return;
        }

        //2D6 (1~6) + (1~6)
        const dice = Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);
        logAction(`주사위 결과 : ${dice}`);

        // 확장 포인트: 여기서 dice === 7 이면 도둑 처리, 아니면 자원 분배 등 호출 가능
        // e.g.
        // if (dice === 7) handleRobberPhase();
        // else distributeResources(dice);

        setDiceRolled(true);
    }, [diceRolled, logAction]);

    // 건설(간단한 가드만 존재 - 실제 자원 / 위치 검증은 게임 스토어 / 보드 모듈과 연결)
    const build = useCallback(() => {
        if(!diceRolled) {
            logAction('주사위를 먼저 굴려야 건설할 수 있습니다.');
            return;
        }

        //확장 포인트: 실제 건설 비용/위치 검증/상태 업데이트 연결
        logAction('건설 완료');
    }, [diceRolled, logAction]);

    //교환 (간단한 가드만 존재 — 실제 교환 비율/항구/은행 검증은 별도 모듈과 연결)
    const trade = useCallback(() => {
        if (!diceRolled) {
            logAction("주사위를 먼저 굴려야 교환할 수 있습니다.");
            return;
        }

         //확장 포인트: 은행/항구 비율 적용, 자원 차감/획득 등 연결
        logAction("교환 실행");
    }, [diceRolled, logAction]);

    

    // 턴이 바뀔때마다 자동으로 새 턴 시작
    useEffect(() => {
        startTurn();
        //컴포넌트 언마운트 / 의존 변경 시 타이머 정리(메모리 누수 방지)
        return () => {
            if(timerRef.current) clearTimeout(timerRef.current);
        };
    }, [startTurn]);

    //players 배열이 외부에서 교체되거나 길이가 변했을 때의 안전장치
    // - 현재 인덱스가 범위를 벗어나면 0으로 되돌림
    useEffect(() => {
        if(!players || players.length === 0) return;
        if(currentPlayerIndex >= players.length) {
            setCurrentPlayerIndex(0);
        }
    }, [players, currentPlayerIndex]);

    return {
        //현재 턴의 플레이어(문자열 또는 객체)
        currentPlayer: players && players.length > 0 ? players[currentPlayerIndex] : null,
        
        //이번 턴에 주사위를 이미 굴렸는지
        diceRolled,

        //액션 핸들러
        rollDice,
        build,
        trade,
        endTurn,

        //로그(문자열 배열)
        log,
    };

}