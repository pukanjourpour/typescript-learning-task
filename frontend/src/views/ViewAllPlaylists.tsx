import React from "react";
import Playlist from "../../../backend/src/models/Playlist";
import { ControllerPlaylists } from "../controllers/ControllerPlaylists";
import { ResponsePlaylistGetAll } from "../../../backend/src/messages/ResponsePlaylistGetAll";

import {
	Avatar,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	Typography,
} from "@mui/material";
import { Folder, Delete } from "@mui/icons-material";
import { ControllerUsers } from "../controllers/ControllerUsers";

interface Props {
	authenticated: boolean,
	sessionHash: string,
	userUuid: string,
}

interface State {
	playlists: Playlist[],
	authors: string[]
}

export default class ViewAllPlaylists extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { playlists: [], authors: [] };
	}

	componentDidMount() {
		if (this.props.authenticated) {
			ControllerPlaylists.getAllPlaylists(this.props.sessionHash, this.props.userUuid).then(
				(p_result: ResponsePlaylistGetAll | null) => {
					if (p_result) {
						let len = p_result.playlist_ids.length;
						for (let i = 0; i < len; i++) {
							this.state.playlists.push({
								playlist_id: p_result.playlist_ids[i],
								user_uuid: p_result.user_uuids[i],
								title: p_result.titles[i],
								description: p_result.descriptions[i],
							} as Playlist);
						}
					}
					return this.initAuthors(this.state.playlists)
				},
			).then(
				(result: string[]) => {
					this.setState({playlists: this.state.playlists, authors: result})
			} )
		}
	}

	initAuthors = async (playlists: Playlist[]) : Promise<string[]> => {
		let authors: string[] = []
		for (let playlist of playlists) {
			let result = await ControllerUsers.getUsernameByUuid(this.props.userUuid, this.props.sessionHash, playlist.user_uuid);
			if (result) {
				authors.push(result.username);
			} else {
				authors.push("");
			}
		}
		return authors
	}

	render() {
		let content;

		const ariaLabel = { "aria-label": "description" };

		if (this.props.authenticated) {
			content =
				<Grid container item rowSpacing={3} justifyContent={"center"}>
					<Grid container item xs={8} direction={"column"}>
						<Grid item xs={5}>
							<List>
								<ListSubheader><Typography variant={"h4"}>Browse Playlists</Typography></ListSubheader>
								{this.state.playlists.map((playlist, index) =>
									<ListItem key={playlist.playlist_id}>
										<ListItemAvatar>
											<Avatar>
												<Folder />
											</Avatar>
										</ListItemAvatar>
										<ListItemText primary={playlist.title} secondary={
											<React.Fragment>
												<Typography
													sx={{ display: "inline" }}
													component="span"
													variant="body2"
													color="text.primary"
												>
													{this.state.authors[index] + " "}
												</Typography>
												{playlist.description}
											</React.Fragment>} />
									</ListItem>)}
							</List>
						</Grid>
					</Grid>
				</Grid>;
		} else {
			content =
				<Typography variant={"h3"} mt={"1rem"} align={"center"}>You must login to view playlists</Typography>;
		}
		return content;
	}

};