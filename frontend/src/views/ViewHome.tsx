import React from "react";
import { Typography } from "@mui/material";
import i18next from "../i18n";

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


	render = () => {
		return <Typography variant={"h2"} mt={"1rem"}
											 align={"center"}> {i18next.t("welcome") + ", " + (this.props.authenticated ? this.props.username : i18next.t("guest"))}</Typography>;
	};
}