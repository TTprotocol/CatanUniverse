import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "../App";
import Home from "./pages/Home";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/Home",
		element: <Home />,
	},
]);

export default function Router() {
	return <RouterProvider router={router} />;
}

// 참조 : https://www.heropy.dev/p/9tesDt
