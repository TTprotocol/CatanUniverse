import {useEffect} from 'react';
import useGameStore from '../state/gameStore';
import {delay} from '../../utils/helpers';

export default function AiTurnManager() {
    const {players, currentPlayerIndex, endTurn} = useGameStore();

    useEffect(() => {
        const currentPlayer = players[currentPlayerIndex]; 

        //1. 게임이 아직 시작되지 않았거나, 현재 턴이 사람이라면 아무것도 하지 않음
        if(!currentPlayer || !currentPlayer.isAi) {
            return;
        }

        //2. AI의 턴 로직 실행
        const playAITurn = async() => {
            console.log(`[AI 턴 시작] ${currentPlayer.name}가 생각중입니다.`);

            //너무 빨리 넘어가면 사람이 인지할 수 없으니까 2초 대기
            await delay(1500);

            //자동으로 턴을 넘기기
            await delay(1000);

            //3. 자동으로 다음 턴으로 넘기기
            endTurn();
        };

        playAITurn();
    }, [currentPlayerIndex, players, endTurn]);

    return null;
}
