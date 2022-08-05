import React from "react";
import { ResponseUserLogin } from "../../../backend/src/messages/ResponseUserLogin";
import { ControllerUsers } from "../controllers/ControllerUsers";
import { Button, Grid, TextField } from "@mui/material";

interface Props {
	onLoginAttempt: (result: ResponseUserLogin | null, username: string) => void;
}

interface State {
	username: string;
	password: string;
}

export default class ViewLogin extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			username: "",
			password: "",
		};
	}

	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// TODO: Login info validation\
		let result = await ControllerUsers.login(this.state.username, this.state.password);
		this.props.onLoginAttempt(result, this.state.username);

		// TODO: display authentication result
	};

	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit}>
					<Grid container direction={"column"} alignItems={"center"} rowSpacing={3} pt={3}>
						<Grid item>
							<TextField required id={"usernameInput"} label="Username"
												 onChange={(val) => this.setState({ username: val.currentTarget.value })} />
						</Grid>
						<Grid item>
							<TextField required id={"passwordInput"} label="Password" type={"password"}
												 onChange={(val) => this.setState({ password: val.currentTarget.value })} />
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
