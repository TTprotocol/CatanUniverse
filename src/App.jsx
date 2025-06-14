// 앱의 루트 컴포넌트입니다. 페이지 라우팅 또는 전체 UI를 구성합니다.

import { useState } from "react";
import "./App.css";
import Home from "./router/pages/Home";

function App() {
	return <Home/>;
}

export default App;
