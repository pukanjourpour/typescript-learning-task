import React from "react";
import { Alert, Button, Grid, TextField } from "@mui/material";
import { ControllerUsers } from "../controllers/ControllerUsers";
import { ResponseUserLogin } from "../../../backend/src/messages/ResponseUserLogin";

interface Props {
	onLogin: (result: ResponseUserLogin, username: string) => void;
}

interface State {
	username: string;
	password: string;
	passwordRepeat: string;
	errorMsg: string | null;
}

export default class ViewRegister extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			passwordRepeat: "",
			errorMsg: null,
		};
	}

	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		let trimmedUsername = this.state.username.trim();
		let trimmedPassword = this.state.password.trim();
		let trimmedPasswordRepeat = this.state.passwordRepeat.trim();
		let usernameRegex = new RegExp("^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$");

		if (usernameRegex.test(trimmedUsername)) {
			if (trimmedPassword === trimmedPasswordRepeat) {
				let registerResult = await ControllerUsers.register(trimmedUsername, trimmedPassword);
				if (registerResult) {
					if (registerResult.is_success) {
						let loginResult = await ControllerUsers.login(trimmedUsername, trimmedPassword);
						if (loginResult) {
							if (loginResult.is_success) {
								this.props.onLogin(loginResult, this.state.username);
							} else {
								this.setState({ errorMsg: loginResult.error_msg });
							}
						} else {
							this.setState({ errorMsg: "Network error" });
						}
					} else {
						this.setState({ errorMsg: registerResult.error_msg });
					}
				} else {
					this.setState({ errorMsg: "Network error" });
				}
			} else {
				this.setState({ errorMsg: "Passwords do not match" });
			}
		} else {
			this.setState({ errorMsg: "Such username is prohibited" });
		}
	};

	render() {
		let alert = null;

		if (this.state.errorMsg) {
			alert = <Grid item><Alert severity="error">{this.state.errorMsg}</Alert></Grid>;
		}

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
						{alert}
						<Grid item>
							<Button type="submit" variant={"contained"}>Register</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		);
	}

}