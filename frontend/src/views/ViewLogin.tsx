import React from "react";
import styled from "styled-components";
import { ControllerUsers } from "../controllers/ControllerUsers";
import { Button, Container, FormControl, Grid, InputLabel, Paper, TextField } from "@mui/material";

interface LoginProps {
	onLoginAttempt: Function;
}

interface LoginState {
}

export default class ViewLogin extends React.Component<LoginProps, LoginState> {
	constructor(props: LoginProps) {
		super(props);
	}

	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let elements = await event.currentTarget.elements;
		// @ts-ignore
		let username = elements.usernameInput.value;
		// @ts-ignore
		let password = elements.passwordInput.value;

		// TODO: Login info validation
		let result = await ControllerUsers.login(username, password);
		this.props.onLoginAttempt(result);
		// TODO: display authentication result
	};

	render() {
		return (
			<div style={{ padding: 30 }}>
				<form onSubmit={this.handleSubmit}>
					<Grid container direction={"column"} alignItems={"center"} rowSpacing={3}>
						<Grid item>
							<TextField required id={"usernameInput"} label="Username" />
						</Grid>
						<Grid item>
							<TextField required id={"passwordInput"} label="Password" type={"password"} />
						</Grid>
						<Grid item>
							<Button type="submit" variant={"contained"}>Login</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		);
	}
}
