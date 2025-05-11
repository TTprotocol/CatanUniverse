// React 앱의 진입점이며, 루트 DOM에 App을 마운트합니다.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Router from "./router";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Router />
	</StrictMode>
);
