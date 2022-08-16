import React from "react";
import { ResponseUserLogin } from "../../../backend/src/messages/ResponseUserLogin";
import { ControllerUsers } from "../controllers/ControllerUsers";
import { Alert, Button, Grid, TextField } from "@mui/material";
import i18next from "../i18n";

interface Props {
	onLogin: (result: ResponseUserLogin, username: string) => void;
}

interface State {
	username: string;
	password: string;
	errorMsg: string | null;
}

export default class ViewLogin extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			errorMsg: null,
		};
	}

	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let trimmedUsername = this.state.username.trim();
		let trimmedPassword = this.state.password.trim();
		let usernameRegex = new RegExp("^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$");

		if (usernameRegex.test(trimmedUsername)) {
			let result = await ControllerUsers.login(trimmedUsername, trimmedPassword);
			if (result) {
				if (result.is_success) {
					this.props.onLogin(result, trimmedUsername);
				} else {
					this.setState({ errorMsg: result.error_msg });
				}
			} else {
				this.setState({ errorMsg: i18next.t("network-error" )});
			}
		} else {
			this.setState({ errorMsg: i18next.t("prohibited-username") });
		}
	};

	render = () => {
		let alert = null;

		if (this.state.errorMsg) {
			alert = <Grid item><Alert severity="error">{this.state.errorMsg}</Alert></Grid>;
		}

		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<Grid container direction={"column"} alignItems={"center"} rowSpacing={3} pt={3}>
						<Grid item>
							<TextField required id={"usernameInput"} label={i18next.t("username").toString()}
												 onChange={(val) => this.setState({ username: val.currentTarget.value })} />
						</Grid>
						<Grid item>
							<TextField required id={"passwordInput"} label={i18next.t("password").toString()} type={"password"}
												 onChange={(val) => this.setState({ password: val.currentTarget.value })} />
						</Grid>
						{alert}
						<Grid item>
							<Button type="submit" variant={"contained"}>{i18next.t("login").toString()}</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		);
	}
}
