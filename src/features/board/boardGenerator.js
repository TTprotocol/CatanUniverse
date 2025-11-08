// 육각형 보드를 무작위로 생성하는 알고리즘입니다.
// 자원 종류, 숫자 타일, 항구 위치 등을 배치합니다.

import {TILE_PIN, PORT_POSITIONS} from '../../utils/constants.js';

//배열 무작위 섞기
function shuffle(array) {
    const arr = [...array];
    for(let i = arr.length-1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

//카탄 기본 자원 종류(19개)
const RESOURCES = [
    "나무", "나무", "나무", "나무",
    "벽돌", "벽돌", "벽돌",
    "양", "양", "양", "양",
    "밀", "밀", "밀", "밀",
    "철", "철", "철",
    "사막",
];

//기본 숫자 타일
const NUMBERS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

//항구 종류
const PORTS = [
    {type : "3:1"},
    {type : "3:1"},
    {type : "3:1"},
    {type : "3:1"},
    {type : "3:1"},
    {type : "2:1_나무"},
    {type : "2:1_벽돌"},
    {type : "2:1_양"},
    {type : "2:1_밀"},
    {type : "2:1_철"},
];


export default function generateRandomBoard() {
    const shuffledResources = shuffle(RESOURCES);
    const shuffledNumbers = shuffle(NUMBERS);
    const shuffledPorts = shuffle(PORTS);

    const tiles = [];
    let robberTileId = null;

    //자원 + 숫자 타일 배치
    TILE_PIN.forEach((tilePin, i) => {
        const resource = shuffledResources[i];
        const tile = {
            id : tilePin.id,
            ...tilePin,
            resource,
            number: resource === '사막' ? null : shuffledNumbers.shift(),
        };

        if(resource === '사막') robberTileId = tile.id;
        tiles.push(tile);
    });

    //항구 배치 => PORT_POSITIONS는 constants.js의 위치 배열
    const ports = (PORT_POSITIONS || []).map((pos, i) => ({
        id : i + 1,
        type: shuffledPorts[i % shuffledPorts.length].type,
        position : pos,
    }));

    //최종 결과 반환
    return {
        tiles,
        ports,
        robber : robberTileId,
    }
}

