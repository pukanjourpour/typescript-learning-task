import React from "react";
import Playlist from "../../../backend/src/models/Playlist";
import { ControllerPlaylists } from "../controllers/ControllerPlaylists";
import { ResponsePlaylistGetUser } from "../../../backend/src/messages/ResponsePlaylistGetUser";
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

interface Props {
	authenticated: boolean,
	sessionHash: string,
	userUuid: string,
}

interface State {
	playlists: Playlist[],
	newPlaylistTitle: string,
	newPlaylistDescription: string,
	selectedPlaylist: Playlist | null
}

export default class ViewMyPlaylists extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { playlists: [], newPlaylistTitle: "", newPlaylistDescription: "", selectedPlaylist: null };
	}

	handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// TODO: Playlist info validation
		let result = await ControllerPlaylists.createPlaylist(this.props.sessionHash, this.props.userUuid, this.state.newPlaylistTitle, this.state.newPlaylistDescription);
		console.log(result);
		if (result) {
			this.state.playlists.push({
				playlist_id: result.playlist_id,
				user_uuid: this.props.userUuid,
				title: this.state.newPlaylistTitle,
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
		// TODO: display creation result
	};

	componentDidMount() {
		if (this.props.authenticated) {
			ControllerPlaylists.getUserPlaylists(this.props.sessionHash, this.props.userUuid).then(
				(result: ResponsePlaylistGetUser | null) => {
					let playlists: Playlist[] = [];
					if (result) {
						let len = result.playlist_ids.length;
						for (let i = 0; i < len; i++) {
							playlists.push({
								playlist_id: result.playlist_ids[i],
								user_uuid: result.user_uuids[i],
								title: result.titles[i],
								description: result.descriptions[i],
							} as Playlist);
						}
					}
					this.setState({ playlists: playlists });
				},
			);
		}
	}

	render() {
		let content;

		const ariaLabel = { "aria-label": "description" };

		if (this.props.authenticated) {
			if (this.state.selectedPlaylist) {
				content =
					<ViewPlaylist selectedPlaylist={this.state.selectedPlaylist} userUuid={this.props.userUuid}
												sessionHash={this.props.sessionHash} />;
			} else {
				content =
					<Grid container justifyContent={"center"} pt={3}>
						<Grid container item rowSpacing={3} xs={8}>
							<Grid container item xs={8} direction={"column"}>
								<Grid item xs={5}>
									<List>
										<ListSubheader><Typography variant={"h4"}>My Playlists</Typography></ListSubheader>
										{this.state.playlists.map((playlist) =>
											<ListItemButton onClick={() => {
												this.setState({ selectedPlaylist: playlist });
											}}>
												<ListItem key={playlist.playlist_id} secondaryAction={
													<IconButton onClick={() => this.handleDelete(playlist.playlist_id)} edge="end"
																			aria-label="delete">
														<Delete />
													</IconButton>
												}>
													<ListItemAvatar>
														<Avatar>
															<Folder />
														</Avatar>
													</ListItemAvatar>
													<ListItemText primary={playlist.title} secondary={playlist.description} />
												</ListItem>
											</ListItemButton>)}
									</List>
								</Grid>
							</Grid>
							<Grid item xs={4}>
								<form onSubmit={this.handleCreate}>
									<Grid container direction={"column"} alignItems={"center"} spacing={3}>
										<Grid item><Typography variant={"h5"}>Create a playlist</Typography></Grid>
										<Grid item xs={8}>
											<Input required onChange={(val) => {
												this.setState({ newPlaylistTitle: val.currentTarget.value });
											}} placeholder="Title" inputProps={ariaLabel} />
										</Grid>
										<Grid item xs={8}>
											<Input required onChange={(val) => {
												this.setState({ newPlaylistDescription: val.currentTarget.value });
											}} placeholder="Description" inputProps={ariaLabel} />
										</Grid>
										<Grid item>
											<Button type="submit" variant="contained" color="success">
												<Typography variant={"button"}>Create new</Typography>
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
				<Typography variant={"h3"} mt={"1rem"} align={"center"}>You must login to view playlists</Typography>;
		}
		return content;
	}

};