import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

interface HeaderProps {
	isLogged: boolean;
}

interface HeaderState {
}

const StyledHeader = styled.div`
  width: 100vw;
  height: 5rem;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 1rem;
    border-bottom: 1px solid black;
  }

  .main-navbar {
    padding: 0;
    margin: 0;
    display: flex;
    gap: 1rem;
    justify-content: center;
    list-style: none;

  }

  .login-navbar {
    padding: 0;
    margin: 0;
    height: 90%;
    gap: 1rem;
    display: flex;
    justify-content: flex-end;
    list-style: none;
  }

  a {
    text-decoration: none;
  }

  .navbar-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    height: 100%;
    color: black;
  }

  .navbar-item:hover {
    color: blue;
  }
`;

export default class Navbar extends React.Component<HeaderProps, HeaderState> {
	constructor(props: HeaderProps) {
		super(props);
	}

	render() {
		let accountMenu: React.ReactNode;

		if (this.props.isLogged) {
			accountMenu =
				<ul className={"login-navbar"}>
					<Link to={"#"}>
						<li className={"navbar-item"}>
							<Typography>Log out</Typography>
						</li>
					</Link>
				</ul>;
		} else {
			accountMenu = (
				<ul className={"login-navbar"}>
					<Link to={"login"}>
						<li className={"navbar-item"}>
							<Typography>Login</Typography>
						</li>
					</Link>
					<Link to={"register"}>
						<li className={"navbar-item"}>
							<Typography>Register</Typography>
						</li>
					</Link>
				</ul>);
		}

		return (
			<StyledHeader>
				<div className={"header"}>
					<Typography variant="h5" className={"logo"}>Playlist app</Typography>
					<ul className={"main-navbar"}>
						<Link to={"/"}>
							<li className={"navbar-item"}>
								<Typography>Home</Typography>
							</li>
						</Link>
						<Link to={"/playlists"}>
							<li className={"navbar-item"}>
								<Typography>Explore playlists</Typography>
							</li>
						</Link>
						<Link to={"/playlists/my"}>
							<li className={"navbar-item"}>
								<Typography>My playlists</Typography>
							</li>
						</Link>
					</ul>
					{accountMenu}
				</div>
			</StyledHeader>
		);
	}
}