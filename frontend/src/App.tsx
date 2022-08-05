import React from "react";
import Navbar from "./views/components/Navbar";
import ViewLogin from "./views/ViewLogin";
import { ResponseUserLogin } from "../../backend/src/messages/ResponseUserLogin";
import ViewRegister from "./views/ViewRegister";
import ViewHome from "./views/ViewHome";
import ViewMyPlaylists from "./views/ViewMyPlaylists";
import ViewAllPlaylists from "./views/ViewAllPlaylists";

interface Props {

}

interface State {
	authenticated: boolean;
	user_uuid: string;
	username: string;
	session_hash: string;
	currentPage: string;
}

export default class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { authenticated: false, currentPage: "home" } as State;
	}

	onLoginAttempt = (response: ResponseUserLogin | null, username: string) => {
		if (response && response.is_success) {
			this.setState({
				authenticated: response.is_success,
				username: username,
				user_uuid: response.user_uuid,
				session_hash: response.session_hash,
			});
			this.onPageChange("home");
		}
	};

	onPageChange = (newPage: string) => {
		this.setState({ currentPage: newPage });
	};

	render() {
		let page;

		switch (this.state.currentPage) {
			case "home":
				page = <ViewHome authenticated={this.state.authenticated} username={this.state.username} />;
				break;
			case "login":
				page = <ViewLogin onLoginAttempt={this.onLoginAttempt} />;
				break;
			case "register":
				page = <ViewRegister onLoginAttempt={this.onLoginAttempt} />;
				break;
			case "my_playlists":
				page = <ViewMyPlaylists authenticated={this.state.authenticated} sessionHash={this.state.session_hash} userUuid={this.state.user_uuid}/>
				break;
			case "all_playlists":
				page = <ViewAllPlaylists authenticated={this.state.authenticated} sessionHash={this.state.session_hash} userUuid={this.state.user_uuid}/>
				break;
			default:
				page = <h1>Page not found</h1>;
		}


		return (
			<div>
				<Navbar activePage={this.state.currentPage} onPageChange={this.onPageChange}
								isLogged={this.state.authenticated} />
				<main>
					{page}
				</main>
			</div>
		);
	}
}