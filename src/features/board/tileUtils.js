// 보드 타일 관련 유틸 함수 모음입니다. (좌표 계산 등)

import { CORNER_PIN, EDGE_PIN, TILE_PIN } from "@/utils/constants";

// 타일 숫자 매핑 (하나의 핀에서 인접한 타일들의 좌표를 매핑하는 함수)
/**
 * 핵심 아이디어(거리 기반):
 *  1) TILE_PIN(타일 중심점)을 타일의 대표 좌표로 사용
 *  2) 각 핀 좌표에서 모든 타일 중심까지의 유클리드 거리 계산
 *  3) 거리 오름차순으로 정렬 후, corner=3개 / edge=2개만 취함
 *  4) 임계 거리(maxDist) 밖의 후보는 제외하여 잘못된 매칭 방지
 */
export const pinIndex = () => {
	if (DEFAULT_TILES.length === 0) return false;

	if (DEFAULT_TILES.length !== TILE_PIN.length) {
		console.log("tile length error");
		return false;
	}

	// 두 점 사이의 거리를 계산
	// Math.hypot : 인자로 받은 하나 이상의 숫자들의 제곱의 합에 대한 제곱근을 계산 => sqrt(a^2 + b^2 + c^2 + ...)
	const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

	// 배열의 중앙값을 반환함
	const median = (arr) => {
		if (!arr.length) return 0;
		const s = [...arr].sort((a, b) => a - b); // 배열을 크기순으로 정렬
		const m = Math.floor(s.length / 2); // 중앙 index를 구함
		return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; // 배열이 짝수이면
	};

	// 타일 중심 좌표의 맵 구성
	const tileCenter = TILE_PIN.reduce((map, p) => {
		map[p.id] = {
			id: p.id,
			x: p.x,
			y: p.y,
		};
		return map;
	}, {});

	// 각 점에서 가장 가까운 다른 점까지의 거리
	const nnDistances = () => {};
};
