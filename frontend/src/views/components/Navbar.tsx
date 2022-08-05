import React from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import "./styles-components.css"

interface Props {
	isLogged: boolean;
	onPageChange: (newPage: string) => void;
	activePage: string;
}

interface State {
}

export default class Navbar extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
	}

	handleClick = (newPage: string) => {
		this.props.onPageChange(newPage);
	};

	render() {
		let accountMenu: React.ReactNode;

		if (this.props.isLogged) {
			accountMenu =
				<ul className={"login-navbar"}>
					<li>
						<div className={"navbar-item"} onClick={() => this.handleClick("logout")}><Typography variant={"button"}>Log
							out</Typography></div>
					</li>
				</ul>;
		} else {
			accountMenu = (
				<ul className={"login-navbar"}>
					<li>
						<div className={(this.props.activePage === "login" ? "active " : "") + "navbar-item"}
								 onClick={() => this.handleClick("login")}
						><Typography variant={"button"}>Login</Typography></div>
					</li>
					<li>
						<div className={(this.props.activePage === "register" ? "active " : "") + "navbar-item"}
								 onClick={() => this.handleClick("register")}><Typography variant={"button"}>Register</Typography></div>
					</li>
				</ul>);
		}

		return (
			<div className={"header-container"}>
				<div className={"header"}>
					<Typography variant="h5" className={"logo"}>Playlist app</Typography>
					<ul className={"main-navbar"}>
						<li>
							<div className={(this.props.activePage === "home" ? "active " : "") + "navbar-item"}
									 onClick={() => this.handleClick("home")}><Typography variant={"button"}>Home</Typography></div>
						</li>
						<li>
							<div className={(this.props.activePage === "all_playlists" ? "active " : "") + "navbar-item"}
									 onClick={() => this.handleClick("all_playlists")}><Typography variant={"button"}>Browse
								playlists</Typography></div>
						</li>
						<li>
							<div className={(this.props.activePage === "my_playlists" ? "active " : "") + "navbar-item"}
									 onClick={() => this.handleClick("my_playlists")}><Typography variant={"button"}>My
								playlists</Typography></div>

						</li>
					</ul>
					{accountMenu}
				</div>
			</div>
		);
	}
}