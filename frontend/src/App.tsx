import React from "react";
import Navbar from "./views/components/Navbar";
import ViewLogin from "./views/ViewLogin";
import { ResponseUserLogin } from "./messages/ResponseUserLogin";
import { Route, Routes } from "react-router-dom";

interface AppProps {

}

interface AppState {
	authenticated: boolean;
	user_uuid: string | null;
	session_hash: string | null;
}

export default class App extends React.Component<AppProps, AppState> {
	constructor(props: AppProps) {
		super(props);
		this.state = { authenticated: false } as AppState;
	}

	onLoginAttempt = (response: ResponseUserLogin) => {
		if (response.is_success) {
			this.setState({
				authenticated: response.is_success,
				user_uuid: response.user_uuid,
				session_hash: response.session_hash,
			});
		}
	};

	render() {
		return (
			<>
				<Navbar isLogged={this.state.authenticated} />
				<Routes>
					<Route path={"/"} element={<h1>Home</h1>}>

					</Route>
					<Route path={"/login"} element={<ViewLogin onLoginAttempt={this.onLoginAttempt} />}>

					</Route>
					<Route path={"*"} element={<h1>Page not found</h1>}>
					</Route>
				</Routes>
			</>
		);
	}
}