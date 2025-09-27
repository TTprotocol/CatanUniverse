// 자원 종류, 개발 카드 목록, 기본 규칙 등의 상수 값 정의입니다.

export const RESOURCE_TYPE = ["tree", "brick", "sheep", "wheat", "steel"]; // 0: 나무, 1: 벽돌, 2: 양, 3: 밀, 4: 철

export const DEVELOPMENT_CARD = [
	"knight", // 0: 기사 - 도둑을 이동시킨다. 최대 14장
	"victoryPoint", // 1: 승점 카드 - 한 장당 승점 1점. 최대 5장
	"roadBuilding", // 2: 도로 건설 - 도로 2개 건설. 최대 2장
	"yearOfPlenty", // 3: 자원 발견 - 원하는 자원카드를 2장 얻는다. 최대 2장
	"monopoly", // 4: 독점 - 모든 플레이어로부터 특정 자원을 전부 뺏는다. 최대 2장
];

export const LOCAL_STORAGE_KEYS = {
	LOCALSTORAGE: "catan_store",
};

export const DEFAULT_TILES = [
	{
		id: 1,
		number: 10,
		resourceId: 4,
		resource: "steel",
		resourceName: "철",
	},
	{
		id: 2,
		number: 2,
		resourceId: 2,
		resource: "sheep",
		resourceName: "양",
	},
	{
		id: 3,
		number: 9,
		resourceId: 0,
		resource: "tree",
		resourceName: "나무",
	},
	{
		id: 4,
		number: 12,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},
	{
		id: 5,
		number: 6,
		resourceId: 1,
		resource: "brick",
		resource: "벽돌",
	},
	{
		id: 6,
		number: 4,
		resourceId: 2,
		resource: "sheep",
		resourceName: "양",
	},
	{
		id: 7,
		number: 10,
		resourceId: 1,
		resource: "brick",
		resource: "벽돌",
	},
	{
		id: 8,
		number: 9,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},
	{
		id: 9,
		number: 11,
		resourceId: 0,
		resource: "tree",
		resourceName: "나무",
	},
	{
		id: 10,
		number: 7,
		resourceId: -1,
		resource: "desert",
		resourceName: "사막",
	},
	{
		id: 11,
		number: 3,
		resourceId: 0,
		resource: "tree",
		resourceName: "나무",
	},
	{
		id: 12,
		number: 8,
		resourceId: 4,
		resource: "steel",
		resourceName: "철",
	},
	{
		id: 13,
		number: 8,
		resourceId: 0,
		resource: "tree",
		resourceName: "나무",
	},
	{
		id: 14,
		number: 3,
		resourceId: 4,
		resource: "steel",
		resourceName: "철",
	},
	{
		id: 15,
		number: 4,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},
	{
		id: 16,
		number: 5,
		resourceId: 2,
		resource: "sheep",
		resourceName: "양",
	},
	{
		id: 17,
		number: 5,
		resourceId: 1,
		resource: "brick",
		resource: "벽돌",
	},
	{
		id: 18,
		number: 6,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},
	{
		id: 19,
		number: 11,
		resourceId: 2,
		resource: "sheep",
		resourceName: "양",
	},
];

// 정착지, 도시를 건설하는 핀
export const CORNER_PIN = [
	{ id: 1, x: 340, y: 135, label: "", tile: [1], edge: [1, 2] },
	{ id: 2, x: 455, y: 135, label: "", tile: [2], edge: [3, 4] },
	{ id: 3, x: 575, y: 135, label: "", tile: [3], edge: [5, 6] },
	{ id: 4, x: 280, y: 165, label: "", tile: [1], edge: [1, 7] },
	{ id: 5, x: 398, y: 165, label: "", tile: [1, 2], edge: [2, 3, 8] },
	{ id: 6, x: 515, y: 165, label: "", tile: [2, 3], edge: [4, 5, 9] },
	{ id: 7, x: 625, y: 165, label: "", tile: [3], edge: [6, 10] },
	{ id: 8, x: 280, y: 230, label: "", tile: [1], edge: [7, 11, 12] },
	{ id: 9, x: 398, y: 230, label: "", tile: [1, 2, 5], edge: [8, 13, 14] },
	{ id: 10, x: 515, y: 230, label: "", tile: [2, 3, 6], edge: [9, 15, 16] },
	{ id: 11, x: 625, y: 230, label: "", tile: [3], edge: [10, 17, 18] },
	{ id: 12, x: 228, y: 260, label: "", tile: [4], edge: [11, 19] },
	{ id: 13, x: 340, y: 260, label: "", tile: [1, 4, 5], edge: [12, 13, 20] },
	{ id: 14, x: 455, y: 260, label: "", tile: [2, 5, 6], edge: [14, 15, 21] },
	{ id: 15, x: 575, y: 260, label: "", tile: [3, 6, 9], edge: [16, 17, 22] },
	{ id: 16, x: 685, y: 260, label: "", tile: [9], edge: [18, 23] },
	{ id: 17, x: 228, y: 335, label: "", tile: [4], edge: [19, 24, 25] },
	{ id: 18, x: 340, y: 335, label: "", tile: [4, 5, 12], edge: [20, 26, 27] },
	{ id: 19, x: 455, y: 335, label: "", tile: [5, 6, 10], edge: [21, 28, 29] },
	{ id: 20, x: 575, y: 335, label: "", tile: [6, 7, 11], edge: [22, 30, 31] },
	{ id: 21, x: 685, y: 335, label: "", tile: [9], edge: [23, 32, 33] },
	{ id: 22, x: 170, y: 360, label: "", tile: [8], edge: [24, 34] },
	{ id: 23, x: 280, y: 360, label: "", tile: [4, 8, 12], edge: [25, 26, 35] },
	{ id: 24, x: 398, y: 360, label: "", tile: [5, 9, 10], edge: [27, 28, 36] },
	{ id: 25, x: 515, y: 360, label: "", tile: [6, 10, 11], edge: [29, 30, 37] },
	{ id: 26, x: 625, y: 360, label: "", tile: [7, 11, 12], edge: [31, 32, 38] },
	{ id: 27, x: 740, y: 360, label: "", tile: [12], edge: [33, 39] },
	{ id: 28, x: 170, y: 430, label: "", tile: [8], edge: [34, 40] },
	{ id: 29, x: 280, y: 430, label: "", tile: [8, 9, 13], edge: [35, 41, 42] },
	{ id: 30, x: 398, y: 430, label: "", tile: [9, 10, 14], edge: [36, 43, 44] },
	{ id: 31, x: 515, y: 430, label: "", tile: [10, 11, 15], edge: [37, 45, 46] },
	{ id: 32, x: 625, y: 430, label: "", tile: [11, 12, 16], edge: [38, 47, 48] },
	{ id: 33, x: 740, y: 430, label: "", tile: [12], edge: [39, 49] },
	{ id: 34, x: 228, y: 460, label: "", tile: [13], edge: [40, 41, 50] },
	{ id: 35, x: 340, y: 460, label: "", tile: [9, 13, 14], edge: [42, 43, 51] },
	{ id: 36, x: 455, y: 460, label: "", tile: [10, 14, 15], edge: [44, 45, 52] },
	{ id: 37, x: 575, y: 460, label: "", tile: [11, 15, 16], edge: [46, 47, 53] },
	{ id: 38, x: 685, y: 460, label: "", tile: [16], edge: [48, 49, 54] },
	{ id: 39, x: 228, y: 525, label: "", tile: [13], edge: [50, 55] },
	{ id: 40, x: 340, y: 525, label: "", tile: [13, 14, 17], edge: [51, 56, 57] },
	{ id: 41, x: 455, y: 525, label: "", tile: [14, 15, 18], edge: [52, 58, 59] },
	{ id: 42, x: 575, y: 525, label: "", tile: [15, 16, 19], edge: [53, 60, 61] },
	{ id: 43, x: 685, y: 525, label: "", tile: [16], edge: [54, 62] },
	{ id: 44, x: 280, y: 560, label: "", tile: [17], edge: [55, 56, 63] },
	{ id: 45, x: 398, y: 560, label: "", tile: [14, 17, 18], edge: [57, 58, 64] },
	{ id: 46, x: 515, y: 560, label: "", tile: [15, 18, 19], edge: [59, 60, 65] },
	{ id: 47, x: 625, y: 560, label: "", tile: [19], edge: [61, 62, 66] },
	{ id: 48, x: 280, y: 625, label: "", tile: [17], edge: [63, 67] },
	{ id: 49, x: 398, y: 625, label: "", tile: [17, 18], edge: [64, 68, 69] },
	{ id: 50, x: 515, y: 625, label: "", tile: [18, 19], edge: [65, 70, 71] },
	{ id: 51, x: 625, y: 625, label: "", tile: [19], edge: [66, 72] },
	{ id: 52, x: 340, y: 660, label: "", tile: [17], edge: [67, 68] },
	{ id: 53, x: 455, y: 660, label: "", tile: [18], edge: [69, 70] },
	{ id: 54, x: 575, y: 660, label: "", tile: [19], edge: [71, 72] },
];
// .map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));

// 도로를 건설하는 핀
export const EDGE_PIN = [
	{ id: 1, x: 310, y: 150, label: "", tile: [1], corner: [1, 4] },
	{ id: 2, x: 370, y: 150, label: "", tile: [1], corner: [1, 5] },
	{ id: 3, x: 425, y: 150, label: "", tile: [2], corner: [2, 5] },
	{ id: 4, x: 485, y: 150, label: "", tile: [2], corner: [2, 6] },
	{ id: 5, x: 545, y: 150, label: "", tile: [3], corner: [3, 6] },
	{ id: 6, x: 600, y: 150, label: "", tile: [3], corner: [3, 7] },
	{ id: 7, x: 280, y: 195, label: "", tile: [1], corner: [4, 8] },
	{ id: 8, x: 398, y: 195, label: "", tile: [1, 2], corner: [5, 9] },
	{ id: 9, x: 515, y: 195, label: "", tile: [2, 3], corner: [6, 10] },
	{ id: 10, x: 625, y: 195, label: "", tile: [3], corner: [7, 11] },
	{ id: 11, x: 254, y: 245, label: "", tile: [1, 4], corner: [8, 12] },
	{ id: 12, x: 310, y: 245, label: "", tile: [1, 4], corner: [8, 13] },
	{ id: 13, x: 370, y: 245, label: "", tile: [2, 5], corner: [9, 13] },
	{ id: 14, x: 425, y: 245, label: "", tile: [2, 6], corner: [9, 14] },
	{ id: 15, x: 485, y: 245, label: "", tile: [3, 6], corner: [10, 14] },
	{ id: 16, x: 545, y: 245, label: "", tile: [3, 6], corner: [10, 15] },
	{ id: 17, x: 600, y: 245, label: "", tile: [7], corner: [11, 15] },
	{ id: 18, x: 655, y: 245, label: "", tile: [7], corner: [11, 16] },
	{ id: 19, x: 228, y: 295, label: "", tile: [4], corner: [12, 17] },
	{ id: 20, x: 340, y: 295, label: "", tile: [4, 5], corner: [13, 18] },
	{ id: 21, x: 455, y: 295, label: "", tile: [5, 6], corner: [14, 19] },
	{ id: 22, x: 575, y: 295, label: "", tile: [6, 7], corner: [15, 20] },
	{ id: 23, x: 685, y: 295, label: "", tile: [7], corner: [16, 21] },
	{ id: 24, x: 198, y: 345, label: "", tile: [4, 8], corner: [17, 22] },
	{ id: 25, x: 254, y: 345, label: "", tile: [4, 8], corner: [17, 23] },
	{ id: 26, x: 310, y: 345, label: "", tile: [5, 9], corner: [18, 23] },
	{ id: 27, x: 370, y: 345, label: "", tile: [5, 9], corner: [18, 24] },
	{ id: 28, x: 425, y: 345, label: "", tile: [6, 10], corner: [19, 24] },
	{ id: 29, x: 485, y: 345, label: "", tile: [6, 10], corner: [19, 25] },
	{ id: 30, x: 545, y: 345, label: "", tile: [6, 11], corner: [20, 25] },
	{ id: 31, x: 600, y: 345, label: "", tile: [7, 11], corner: [20, 26] },
	{ id: 32, x: 655, y: 345, label: "", tile: [7, 12], corner: [21, 26] },
	{ id: 33, x: 715, y: 345, label: "", tile: [12], corner: [21, 27] },
	{ id: 34, x: 170, y: 395, label: "", tile: [8], corner: [22, 28] },
	{ id: 35, x: 280, y: 395, label: "", tile: [8, 9], corner: [23, 29] },
	{ id: 36, x: 398, y: 395, label: "", tile: [9, 10], corner: [24, 30] },
	{ id: 37, x: 515, y: 395, label: "", tile: [10, 11], corner: [25, 31] },
	{ id: 38, x: 625, y: 395, label: "", tile: [11, 12], corner: [26, 32] },
	{ id: 39, x: 740, y: 395, label: "", tile: [12], corner: [27, 33] },
	{ id: 40, x: 198, y: 445, label: "", tile: [8, 13], corner: [28, 34] },
	{ id: 41, x: 254, y: 445, label: "", tile: [8, 13], corner: [29, 34] },
	{ id: 42, x: 310, y: 445, label: "", tile: [9, 13], corner: [29, 35] },
	{ id: 43, x: 370, y: 445, label: "", tile: [9, 14], corner: [30, 35] },
	{ id: 44, x: 425, y: 445, label: "", tile: [10, 14], corner: [30, 36] },
	{ id: 45, x: 485, y: 445, label: "", tile: [10, 15], corner: [31, 36] },
	{ id: 46, x: 545, y: 445, label: "", tile: [11, 15], corner: [31, 37] },
	{ id: 47, x: 600, y: 445, label: "", tile: [11, 16], corner: [32, 37] },
	{ id: 48, x: 655, y: 445, label: "", tile: [12, 16], corner: [32, 38] },
	{ id: 49, x: 715, y: 445, label: "", tile: [16], corner: [33, 38] },
	{ id: 50, x: 228, y: 494, label: "", tile: [13], corner: [34, 39] },
	{ id: 51, x: 340, y: 494, label: "", tile: [13, 14], corner: [35, 40] },
	{ id: 52, x: 455, y: 494, label: "", tile: [14, 15], corner: [36, 41] },
	{ id: 53, x: 575, y: 494, label: "", tile: [15, 16], corner: [37, 42] },
	{ id: 54, x: 685, y: 494, label: "", tile: [16], corner: [38, 43] },
	{ id: 55, x: 254, y: 545, label: "", tile: [13, 17], corner: [39, 44] },
	{ id: 56, x: 310, y: 545, label: "", tile: [17, 13], corner: [40, 44] },
	{ id: 57, x: 370, y: 545, label: "", tile: [17, 14], corner: [40, 45] },
	{ id: 58, x: 425, y: 545, label: "", tile: [18, 14], corner: [41, 45] },
	{ id: 59, x: 485, y: 545, label: "", tile: [18, 15], corner: [41, 46] },
	{ id: 60, x: 545, y: 545, label: "", tile: [19, 15], corner: [42, 46] },
	{ id: 61, x: 600, y: 545, label: "", tile: [19, 16], corner: [42, 47] },
	{ id: 62, x: 655, y: 545, label: "", tile: [19, 16], corner: [43, 47] },
	{ id: 63, x: 280, y: 593, label: "", tile: [17], corner: [44, 48] },
	{ id: 64, x: 398, y: 593, label: "", tile: [17, 18], corner: [45, 49] },
	{ id: 65, x: 515, y: 593, label: "", tile: [18, 19], corner: [46, 50] },
	{ id: 66, x: 625, y: 593, label: "", tile: [19], corner: [47, 51] },
	{ id: 67, x: 310, y: 645, label: "", tile: [17], corner: [48, 52] },
	{ id: 68, x: 370, y: 645, label: "", tile: [17, 18], corner: [49, 52] },
	{ id: 69, x: 425, y: 645, label: "", tile: [18], corner: [49, 53] },
	{ id: 70, x: 485, y: 645, label: "", tile: [18, 19], corner: [50, 53] },
	{ id: 71, x: 545, y: 645, label: "", tile: [19], corner: [50, 54] },
	{ id: 72, x: 600, y: 645, label: "", tile: [19], corner: [51, 54] },
];
// .map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));

// 타일을 클릭하는 핀 (도둑 이동용)
export const TILE_PIN = [
	{
		id: 1,
		x: 340,
		y: 200,
		label: "",
		corner: [1, 4, 5, 8, 9, 13],
		edge: [1, 2, 7, 8, 11, 12],
	}, // 10번 타일
	{
		id: 2,
		x: 455,
		y: 200,
		label: "",
		corner: [2, 5, 6, 9, 10, 14],
		edge: [2, 3, 4, 8, 9, 14],
	}, // 2번 타일
	{
		id: 3,
		x: 575,
		y: 200,
		label: "",
		corner: [3, 6, 7, 10, 11, 15],
		edge: [4, 5, 6, 9, 10, 16],
	}, // 9번 타일
	{
		id: 4,
		x: 280,
		y: 300,
		label: "",
		corner: [12, 13, 17, 18, 23],
		edge: [11, 12, 19, 20, 24, 25],
	}, // 12번 타일
	{
		id: 5,
		x: 398,
		y: 300,
		label: "",
		corner: [9, 13, 14, 18, 19, 24],
		edge: [12, 13, 20, 21, 26, 27],
	}, // 6번 타일
	{
		id: 6,
		x: 515,
		y: 300,
		label: "",
		corner: [10, 14, 15, 19, 20, 25],
		edge: [14, 15, 21, 22, 28, 29],
	}, // 4번 타일
	{
		id: 7,
		x: 625,
		y: 300,
		label: "",
		corner: [20, 21, 26],
		edge: [16, 17, 30, 31],
	}, // 10번 타일
	{
		id: 8,
		x: 228,
		y: 400,
		label: "",
		corner: [22, 23, 28, 29, 34, 35],
		edge: [24, 34, 35, 40, 41, 50],
	}, // 9번 타일
	{
		id: 9,
		x: 340,
		y: 400,
		label: "",
		corner: [24, 29, 30, 35, 36, 19],
		edge: [21, 35, 36, 42, 43, 20],
	}, // 11번 타일
	{
		id: 10,
		x: 455,
		y: 400,
		label: "",
		corner: [24, 25, 30, 31, 36, 37],
		edge: [27, 28, 36, 37, 44, 45],
	}, // 7번 타일 (사막)
	{
		id: 11,
		x: 575,
		y: 400,
		label: "",
		corner: [25, 26, 31, 32, 37, 38],
		edge: [29, 30, 37, 38, 46, 47],
	}, // 3번 타일
	{
		id: 12,
		x: 685,
		y: 400,
		label: "",
		corner: [21, 26, 27, 32, 33],
		edge: [31, 32, 33, 38, 39, 48, 49],
	}, // 8번 타일
	{
		id: 13,
		x: 280,
		y: 500,
		label: "",
		corner: [29, 34, 35, 39, 40, 41],
		edge: [41, 42, 50, 51, 55, 56],
	}, // 8번 타일
	{
		id: 14,
		x: 398,
		y: 500,
		label: "",
		corner: [30, 35, 36, 40, 41, 45],
		edge: [43, 44, 51, 52, 57, 58],
	}, // 3번 타일
	{
		id: 15,
		x: 515,
		y: 500,
		label: "",
		corner: [31, 36, 37, 41, 42, 46],
		edge: [45, 46, 52, 53, 59, 60],
	}, // 4번 타일
	{
		id: 16,
		x: 625,
		y: 500,
		label: "",
		corner: [32, 37, 38, 42, 43, 47],
		edge: [47, 48, 53, 54, 61, 62],
	}, // 5번 타일
	{
		id: 17,
		x: 340,
		y: 600,
		label: "",
		corner: [40, 44, 45, 48, 49, 52],
		edge: [55, 56, 63, 64, 67, 68],
	}, // 5번 타일
	{
		id: 18,
		x: 455,
		y: 600,
		label: "",
		corner: [41, 45, 46, 49, 50, 53],
		edge: [56, 57, 64, 65, 69, 70],
	}, // 6번 타일
	{
		id: 19,
		x: 575,
		y: 600,
		label: "",
		corner: [42, 46, 47, 50, 51, 54],
		edge: [58, 59, 60, 61, 66, 71, 72],
	}, // 11번 타일
];
// .map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));
