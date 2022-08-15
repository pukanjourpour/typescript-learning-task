import React from "react";
import Playlist from "../../../backend/src/models/Playlist";
import { ControllerPlaylists } from "../controllers/ControllerPlaylists";
import { ResponsePlaylistGetAll } from "../../../backend/src/messages/ResponsePlaylistGetAll";

import {
	Avatar,
	Grid,
	List,
	ListItem,
	ListItemAvatar, ListItemButton,
	ListItemText,
	ListSubheader,
	Typography,
} from "@mui/material";
import { Folder } from "@mui/icons-material";
import { ControllerUsers } from "../controllers/ControllerUsers";
import ViewPlaylist from "./ViewPlaylist";

interface Props {
	authenticated: boolean,
	sessionHash: string,
	userUuid: string,
}

interface State {
	playlists: Playlist[],
	authors: string[],
	selectedPlaylist: Playlist | null,
	selectedPlaylistAuthor: string,
}

export default class ViewAllPlaylists extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { playlists: [], authors: [], selectedPlaylist: null, selectedPlaylistAuthor: "" };
	}

	async componentDidMount() {
		if (this.props.authenticated) {
			let result = await ControllerPlaylists.getAllPlaylists(this.props.sessionHash, this.props.userUuid);
			if (result) {
				if (result.playlists.length > 0) {
					let authors = await this.initAuthors(result.playlists);
					this.setState({ playlists: result.playlists, authors: authors });
				}
			}
		}
	}

	initAuthors = async (playlists: Playlist[]): Promise<string[]> => {
		let authors: string[] = [];
		for (let playlist of playlists) {
			let result = await ControllerUsers.getUsernameByUuid(this.props.userUuid, this.props.sessionHash, playlist.playlist_user_uuid);
			if (result) {
				authors.push(result.username);
			} else {
				authors.push("");
			}
		}
		return authors;
	};

	render() {
		let content;

		if (this.props.authenticated) {
			if (this.state.selectedPlaylist) {
				content = <ViewPlaylist selectedPlaylist={this.state.selectedPlaylist}
																selectedPlaylistAuthor={this.state.selectedPlaylistAuthor}
																userUuid={this.props.userUuid}
																sessionHash={this.props.sessionHash} />;
			} else {
				content =
					<Grid container item rowSpacing={3} justifyContent={"center"} pt={3}>
						<Grid container item xs={8} direction={"column"}>
							<Grid item xs={5}>
								<List>
									<ListSubheader><Typography variant={"h4"}>Browse Playlists</Typography></ListSubheader>
									{this.state.playlists.map((playlist, index) =>
										<ListItemButton key={playlist.playlist_id} onClick={() => {
											this.setState({ selectedPlaylist: playlist, selectedPlaylistAuthor: this.state.authors[index] });
										}}>
											<ListItem>
												<ListItemAvatar>
													<Avatar>
														<Folder />
													</Avatar>
												</ListItemAvatar>
												<ListItemText primary={playlist.playlist_title} secondary={
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
											</ListItem>
										</ListItemButton>)}
								</List>
							</Grid>
						</Grid>
					</Grid>;
			}
		} else {
			content =
				<Typography variant={"h3"} mt={"1rem"} align={"center"}>You must login to view playlists</Typography>;
		}
		return content;
	}

};