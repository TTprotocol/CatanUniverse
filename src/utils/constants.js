// 자원 종류, 개발 카드 목록, 기본 규칙 등의 상수 값 정의입니다.

export const RESOURCE_TYPE = ["brick", "sheep", "steel", "tree", "wheat"]; // 0: 벽돌, 1: 양, 2: 철, 3: 나무, 4: 밀

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
		id: "tile1",
		number: 2,
		resourceId: 1,
		resource: "sheep",
		resourceName: "양",
	},

	{
		id: "tile2",
		number: 3,
		resourceId: 3,
		resource: "tree",
		resourceName: "나무",
	},

	{
		id: "tile3",
		number: 3,
		resourceId: 2,
		resource: "steel",
		resourceName: "철",
	},

	{
		id: "tile4",
		number: 4,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},

	{
		id: "tile5",
		number: 4,
		resourceId: 1,
		resource: "sheep",
		resourceName: "양",
	},

	{
		id: "tile6",
		number: 5,
		resourceId: 1,
		resource: "sheep",
		resourceName: "양",
	},

	{
		id: "tile7",
		number: 5,
		resourceId: 0,
		resource: "brick",
		resource: "벽돌",
	},

	{
		id: "tile8",
		number: 6,
		resourceId: 0,
		resource: "brick",
		resource: "벽돌",
	},

	{
		id: "tile9",
		number: 6,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},

	{
		id: "tile10",
		number: 7,
		resourceId: -1,
		resource: "desert",
		resourceName: "사막",
	},

	{
		id: "tile11",
		number: 8,
		resourceId: 2,
		resource: "steel",
		resourceName: "철",
	},

	{
		id: "tile12",
		number: 8,
		resourceId: 3,
		resource: "tree",
		resourceName: "나무",
	},

	{
		id: "tile13",
		number: 9,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},

	{
		id: "tile14",
		number: 9,
		resourceId: 3,
		resource: "tree",
		resourceName: "나무",
	},

	{
		id: "tile15",
		number: 10,
		resourceId: 0,
		resource: "brick",
		resource: "벽돌",
	},

	{
		id: "tile16",
		number: 10,
		resourceId: 2,
		resource: "steel",
		resourceName: "철",
	},

	{
		id: "tile17",
		number: 11,
		resourceId: 1,
		resource: "sheep",
		resourceName: "양",
	},

	{
		id: "tile18",
		number: 11,
		resourceId: 3,
		resource: "tree",
		resourceName: "나무",
	},

	{
		id: "tile19",
		number: 12,
		resourceId: 3,
		resource: "wheat",
		resourceName: "밀",
	},
];

// 정착지, 도시를 건설하는 핀
export const CORNER_PIN = [
	[340, 135],
	[455, 135],
	[575, 135],
	[280, 165],
	[398, 165],
	[515, 165],
	[625, 165],
	[280, 230],
	[398, 230],
	[515, 230],
	[625, 230],
	[228, 260],
	[340, 260],
	[455, 260],
	[575, 260],
	[685, 260],
	[228, 335],
	[340, 335],
	[455, 335],
	[575, 335],
	[685, 335],
	[170, 360],
	[280, 360],
	[398, 360],
	[515, 360],
	[625, 360],
	[740, 360],
	[170, 430],
	[280, 430],
	[398, 430],
	[515, 430],
	[625, 430],
	[740, 430],
	[228, 460],
	[340, 460],
	[455, 460],
	[575, 460],
	[685, 460],
	[228, 525],
	[340, 525],
	[455, 525],
	[575, 525],
	[685, 525],
	[280, 560],
	[398, 560],
	[515, 560],
	[625, 560],
	[280, 625],
	[398, 625],
	[515, 625],
	[625, 625],
	[340, 660],
	[455, 660],
	[575, 660],
].map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));

// 도로를 건설하는 핀
export const EDGE_PIN = [
	[310, 150],
	[370, 150],
	[425, 150],
	[485, 150],
	[545, 150],
	[600, 150],
	[280, 195],
	[398, 195],
	[515, 195],
	[625, 195],
	[254, 245],
	[310, 245],
	[370, 245],
	[425, 245],
	[485, 245],
	[545, 245],
	[600, 245],
	[655, 245],
	[228, 295],
	[340, 295],
	[455, 295],
	[575, 295],
	[685, 295],
	[198, 345],
	[254, 345],
	[310, 345],
	[370, 345],
	[425, 345],
	[485, 345],
	[545, 345],
	[600, 345],
	[655, 345],
	[715, 345],
	[170, 395],
	[280, 395],
	[398, 395],
	[515, 395],
	[625, 395],
	[740, 395],
	[198, 445],
	[254, 445],
	[310, 445],
	[370, 445],
	[425, 445],
	[485, 445],
	[545, 445],
	[600, 445],
	[655, 445],
	[715, 445],
	[228, 494],
	[340, 494],
	[455, 494],
	[575, 494],
	[685, 494],
	[254, 545],
	[310, 545],
	[370, 545],
	[425, 545],
	[485, 545],
	[545, 545],
	[600, 545],
	[655, 545],
	[280, 593],
	[398, 593],
	[515, 593],
	[625, 593],
	[310, 645],
	[370, 645],
	[425, 645],
	[485, 645],
	[545, 645],
	[600, 645],
].map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));

// 타일을 클릭하는 핀 (도둑 이동용)
export const TILE_PIN = [
	[340, 200],
	[455, 200],
	[575, 200],
	[280, 300],
	[398, 300],
	[515, 300],
	[625, 300],
	[228, 400],
	[340, 400],
	[455, 400],
	[575, 400],
	[685, 400],
	[280, 500],
	[398, 500],
	[515, 500],
	[625, 500],
	[340, 600],
	[455, 600],
	[575, 600],
].map(([x, y], index) => ({ id: index + 1, x, y, label: "" }));
