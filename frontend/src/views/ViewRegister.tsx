import React from "react";
import { Button, Grid, TextField } from "@mui/material";
import { ControllerUsers } from "../controllers/ControllerUsers";
import { ResponseUserLogin } from "../../../backend/src/messages/ResponseUserLogin";

interface Props {
	onLoginAttempt: (result: ResponseUserLogin | null, username: string) => void;
}

interface State {
	username: string;
	password: string;
	passwordRepeat: string;
}

export default class ViewRegister extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (this.state.password === this.state.passwordRepeat) {
			let registerResult = await ControllerUsers.register(this.state.username, this.state.password);
			if (registerResult) {
				if (registerResult.is_success) {
					let loginResult = await ControllerUsers.login(this.state.username, this.state.password)
					this.props.onLoginAttempt(loginResult, this.state.username)
				} else {
					console.log(registerResult.error_msg)
				}
			}
		} else {
			console.log("Passwords do not match")
		}

	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<Grid container direction={"column"} alignItems={"center"} rowSpacing={3} p={3}>
						<Grid item>
							<TextField required id={"usernameInput"} label="Username"
												 onChange={(val) => this.setState({ username: val.currentTarget.value })} />
						</Grid>
						<Grid item>
							<TextField required id={"passwordInput"} label="Password" type={"password"}
												 onChange={(val) => this.setState({ password: val.currentTarget.value })} />
						</Grid>
						<Grid item>
							<TextField required id={"passwordRepeatInput"} label="Repeat password" type={"password"}
												 onChange={(val) => this.setState({ passwordRepeat: val.currentTarget.value })} />
						</Grid>
						<Grid item>
							<Button type="submit" variant={"contained"}>Register</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		);
	}

}