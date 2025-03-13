import { checkStrEmpty, emailRegex } from "@netsu/js-utils";
import { Button, Input, message, Space, Typography } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useLocation } from "wouter";
import { MethodSetUserCreateModel } from "/imports/api/users/models";
import { publicRoutes } from "/imports/utils/constants/routes";
import { errorResponse } from "/imports/utils/errors";

const SignupPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// display loader while logging in
	const [loggingIn, setLoggingIn] = useState(false);
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [location, navigate] = useLocation();

	const handleSubmit = async () => {
		const cleanedEmail = email.trim();
		const cleanedUsername = username.trim();
		const cleanedFirstName = firstName.trim();
		const cleanedLastName = lastName.trim();

		if (!emailRegex.test(cleanedEmail)) {
			return message.error("Email is invalid");
		}

		if (password.length < 8) {
			return message.error("Password is too short");
		}

		if (cleanedUsername.length < 3) {
			return message.error("Username is too short");
		}

		if (checkStrEmpty(cleanedFirstName)) {
			return message.error("First name is required");
		}

		setLoggingIn(true);

		try {
			const data: MethodSetUserCreateModel = {
				email: cleanedEmail,
				firstName: cleanedFirstName,
				lastName: cleanedLastName,
				password,
				username: cleanedUsername,
			};

			await Meteor.callAsync("set.user.create", data);
		} catch (error) {
			setLoggingIn(false);

			return errorResponse(error as Meteor.Error, "Could not create account");
		}

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
			<Typography.Title level={2}>Create your account</Typography.Title>

			<Input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
			/>
			<Input
				addonBefore="@"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
			/>
			<Input
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
				placeholder="First Name"
			/>
			<Input
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
				placeholder="Last Name (optional)"
			/>
			<Input.Password
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
			/>

			<Button type="primary" onClick={handleSubmit}>
				Sign Up
			</Button>

			<Typography>
				Already have an account?{" "}
				<Button type="link" onClick={() => navigate(publicRoutes.login.path)}>
					Login
				</Button>
			</Typography>
		</Space>
	);
};

export default SignupPage;
