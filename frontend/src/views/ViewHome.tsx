import React from "react";
import { Typography } from "@mui/material";

interface Props {
	authenticated: boolean,
	username: string | null
}

interface State {

}

export default class ViewHome extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

	}

	render() {
		return <Typography variant={"h2"} mt={"1rem"} align={"center"}>Welcome, {this.props.authenticated ? this.props.username : "guest"}!</Typography>;
	}
}