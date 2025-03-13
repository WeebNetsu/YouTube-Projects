import { emailRegex } from "@netsu/js-utils";
import { Button, Input, message, Space, Typography } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useLocation } from "wouter";
import { publicRoutes } from "/imports/utils/constants/routes";
import { errorResponse } from "/imports/utils/errors";

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// display loader while logging in
	const [loggingIn, setLoggingIn] = useState(false);
	const [location, navigate] = useLocation();

	const handleSubmit = async () => {
		const cleanedEmail = email.trim();

		if (!emailRegex.test(cleanedEmail)) {
			return message.error("Email is invalid");
		}

		if (password.length < 8) {
			return message.error("Password is too short");
		}

		setLoggingIn(true);

		Meteor.loginWithPassword(cleanedEmail, password, (error: Meteor.Error) => {
			setLoggingIn(false);

			if (error) {
				return errorResponse(error, "Could not log in");
			}

			navigate(publicRoutes.home.path);
		});
	};

	return (
		<Space direction="vertical">
			<Typography.Title level={2}>Sign in to your account</Typography.Title>

			<Input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="email"
			/>
			<Input.Password
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="password"
			/>

			<Button type="primary" onClick={handleSubmit}>
				Log In
			</Button>

			<Typography>
				Don't have an account?{" "}
				<Button type="link" onClick={() => navigate(publicRoutes.signup.path)}>
					Create one
				</Button>
			</Typography>
		</Space>
	);
};

export default LoginPage;
