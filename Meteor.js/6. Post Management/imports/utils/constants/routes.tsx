import React from "react";
import BrowsePage from "/imports/ui/BrowsePage";
import LoginPage from "/imports/ui/LoginPage";
import SignupPage from "/imports/ui/SignupPage";

/**
 * User does not have to be logged in to view these routes
 */
export const publicRoutes = {
	// NOTE: Route order matters, root routes should be below their children
	login: {
		path: "/login",
		element: (<LoginPage />) as React.ReactNode,
	},
	signup: {
		path: "/signup",
		element: (<SignupPage />) as React.ReactNode,
	},
	home: {
		path: "/",
		element: (<BrowsePage />) as React.ReactNode,
	},
	default: {
		path: "*",
		element: (<LoginPage />) as React.ReactNode,
	},
};

/**
 * User has to be logged in to view these routes
 */
export const protectedRoutes = {};
