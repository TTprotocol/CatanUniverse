// zustand와는 별개의 저장 항목을 localStorage에 저장
// 예: 유저 설정, 사운드 ON/OFF, AI 난이도 등 => 당장은 필요하지 않음!

const LOCAL_KEYS = {
	SETTINGS: "catan-settings",
};

export const saveSettings = (settings) => {
	localStorage.setItem(LOCAL_KEYS.SETTINGS, JSON.stringify(settings));
};

export const loadSettings = () => {
	const data = localStorage.getItem(LOCAL_KEYS.SETTINGS);
	return data ? JSON.parse(data) : null;
};

export const clearSettings = () => {
	localStorage.removeItem(LOCAL_KEYS.SETTINGS);
};
