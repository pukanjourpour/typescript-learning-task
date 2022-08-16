import React from "react";
import Playlist from "../../../backend/src/models/Playlist";
import { ControllerPlaylists } from "../controllers/ControllerPlaylists";
import {
	Avatar,
	Button,
	Grid, IconButton,
	Input,
	List,
	ListItem,
	ListItemAvatar, ListItemButton,
	ListItemText,
	ListSubheader,
	Typography,
} from "@mui/material";
import { Folder, Delete } from "@mui/icons-material";
import ViewPlaylist from "./ViewPlaylist";
import i18next from "../i18n";

interface Props {
	authenticated: boolean,
	sessionHash: string,
	userUuid: string,
	username: string
}

interface State {
	playlists: Playlist[],
	newPlaylistTitle: string,
	newPlaylistDescription: string,
	selectedPlaylist: Playlist | null,
}

export default class ViewMyPlaylists extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			playlists: [],
			newPlaylistTitle: "",
			newPlaylistDescription: "",
			selectedPlaylist: null,
		};
	}

	handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// TODO: Playlist info validation
		let result = await ControllerPlaylists.createPlaylist(this.props.sessionHash, this.props.userUuid, this.state.newPlaylistTitle, this.state.newPlaylistDescription);
		console.log(result);
		if (result) {
			this.state.playlists.push({
				playlist_id: result.playlist_id,
				playlist_user_uuid: this.props.userUuid,
				playlist_title: this.state.newPlaylistTitle,
				description: this.state.newPlaylistDescription,
			} as Playlist);
			this.setState({ playlists: this.state.playlists });
		}
		// TODO: display creation result
	};

	handleDelete = async (playlistId: number | null) => {
		// TODO: Playlist info validation
		if (playlistId) {
			let result = await ControllerPlaylists.deletePlaylist(this.props.sessionHash, this.props.userUuid, playlistId);
			console.log(result);
			if (result) {
				let filtered = this.state.playlists.filter(function(value: Playlist) {
					return value.playlist_id != playlistId;
				});
				this.setState({ playlists: filtered });
			}
		}
	};

	componentDidMount = async () => {
		if (this.props.authenticated) {
			let result = await ControllerPlaylists.getUserPlaylists(this.props.sessionHash, this.props.userUuid);
			if (result) {
				if (result.is_success) {
					this.setState({ playlists: result.playlists });
				} else {
					// do something
				}
			} else {
				//	do something
			}
		}
	};

	render = () => {
		let content;

		if (this.props.authenticated) {
			if (this.state.selectedPlaylist) {
				content =
					<ViewPlaylist selectedPlaylist={this.state.selectedPlaylist}
												selectedPlaylistAuthor={this.props.username}
												userUuid={this.props.userUuid}
												sessionHash={this.props.sessionHash} />;
			} else {
				content =
					<Grid container justifyContent={"center"} pt={3}>
						<Grid container item rowSpacing={3} xs={8}>
							<Grid container item xs={8} direction={"column"}>
								<Grid item xs={5}>
									<List>
										<ListSubheader><Typography variant={"h4"}>{i18next.t("my-playlists").toString()}</Typography></ListSubheader>
										{this.state.playlists.map((playlist) =>
											<ListItem key={playlist.playlist_id} secondaryAction={
												<IconButton onClick={() => this.handleDelete(playlist.playlist_id)} edge="end"
																		aria-label="delete">
													<Delete />
												</IconButton>
											}>
												<ListItemButton onClick={() => {
													this.setState({ selectedPlaylist: playlist });
												}}>
													<ListItemAvatar>
														<Avatar>
															<Folder />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary={playlist.playlist_title} secondary={playlist.description} />
												</ListItemButton>
											</ListItem>)}
									</List>
								</Grid>
							</Grid>
							<Grid item xs={4}>
								<form onSubmit={this.handleCreate}>
									<Grid container direction={"column"} alignItems={"center"} spacing={3}>
										<Grid item><Typography variant={"h5"}>{i18next.t("create-new-playlist").toString()}</Typography></Grid>
										<Grid item xs={8}>
											<Input required onChange={(val) => {
												this.setState({ newPlaylistTitle: val.currentTarget.value });
											}} placeholder={i18next.t("title").toString()} inputProps={{ "aria-label": "title" }} />
										</Grid>
										<Grid item xs={8}>
											<Input required onChange={(val) => {
												this.setState({ newPlaylistDescription: val.currentTarget.value });
											}} placeholder={i18next.t("description").toString()} inputProps={{ "aria-label": "description" }} />
										</Grid>
										<Grid item>
											<Button type="submit" variant="contained" color="success">
												<Typography variant={"button"}>{i18next.t("create-new-playlist-btn").toString()}</Typography>
											</Button>
										</Grid>
									</Grid>
								</form>
							</Grid>
						</Grid>
					</Grid>;
			}
		} else {
			content =
				<Typography variant={"h3"} mt={"1rem"} align={"center"}>{i18next.t("login-required-playlists").toString()}</Typography>;
		}
		return content;
	};

};