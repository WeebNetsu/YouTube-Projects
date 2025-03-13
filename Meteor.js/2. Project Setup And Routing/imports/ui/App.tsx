import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, theme } from "antd";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import React from "react";
import { Route, Switch } from "wouter";
import { ComponentProps } from "../types/interfaces";
import { protectedRoutes, publicRoutes } from "../utils/constants/routes";

/**
 * Defines the type for a userId on login
 *
 * null - not logged in
 * undefined - loading data
 * string - logged in (user id)
 */
export type AppUserIdModel = string | undefined | null;

export interface BasicSiteProps extends ComponentProps {}

const App: React.FC = () => {
	const userId: AppUserIdModel = useTracker(() => Meteor.userId());

	// user is not logged in
	if (userId === null) {
		// you can add any config providers here to cover all public routes
		return (
			<ConfigProvider
				theme={{
					// change to defaultAlgorithm for light theme
					// will be changed to dark algorithm later
					algorithm: theme.defaultAlgorithm,
				}}
			>
				<Switch>
					{Object.values(publicRoutes).map((route) => (
						<Route key={route.path} path={route.path}>
							{route.element}
						</Route>
					))}
				</Switch>
			</ConfigProvider>
		);
	}

	// still loading data from backend
	if (userId === undefined) return <LoadingOutlined />;

	// you can add any config providers here to cover all protected routes
	return (
		<ConfigProvider
			theme={{
				// change to defaultAlgorithm for light theme
				algorithm: theme.darkAlgorithm,
			}}
		>
			<Switch>
				{Object.values(protectedRoutes).map((route: any) => (
					<Route key={route.path} path={route.path}>
						{route.element}
					</Route>
				))}

				{/* since public routes contains the home routes, they need to be placed last */}
				{Object.values(publicRoutes).map((route) => (
					<Route key={route.path} path={route.path}>
						{route.element}
					</Route>
				))}
			</Switch>
		</ConfigProvider>
	);
};

export default App;
