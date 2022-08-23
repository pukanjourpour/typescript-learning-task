import React from "react";
import Song from "../../../backend/src/models/Song";
import Playlist from "../../../backend/src/models/Playlist";
import {
	Button,
	Grid,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import { ControllerSongs } from "../controllers/ControllerSongs";
import { ControllerPlaylists } from "../controllers/ControllerPlaylists";

interface Props {
	selectedSongId: number | null;
	selectedPlaylistId: number | null;
	userUuid: string;
	sessionHash: string;
}

interface State {
	song: Song;
	file_b64: string;
	addToPlaylistMenu: boolean;
	chosenPlaylistId: number;
	userPlaylists: Playlist[] | null;
}

export default class ViewSong extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			song: {} as Song,
			file_b64: "",
			addToPlaylistMenu: false,
			chosenPlaylistId: -1,
			userPlaylists: null,
		};
	}

	componentDidMount = async () => {
		if (this.props.selectedSongId) {
			let result = await ControllerSongs.getSong(
				this.props.sessionHash,
				this.props.userUuid,
				this.props.selectedSongId,
			);
			if (result?.is_success) {
				this.setState({
					song: {
						song_title: result.title,
						artist: result.artist,
						album: result.album,
					} as Song,
					file_b64: "data:audio/wav;base64," + result.file_b64,
				});
				let playlists_result = await ControllerPlaylists.getUserPlaylists(
					this.props.sessionHash,
					this.props.userUuid,
				);
				if (playlists_result?.is_success) {
					this.setState({ userPlaylists: playlists_result.playlists });
				}
			}
		}
	};

	componentDidUpdate = async (prevProps: Readonly<Props>) => {
		if (
			this.props.selectedSongId &&
			prevProps.selectedSongId != this.props.selectedSongId
		) {
			let result = await ControllerSongs.getSong(
				this.props.sessionHash,
				this.props.userUuid,
				this.props.selectedSongId,
			);
			if (result) {
				this.setState({
					song: {
						song_title: result.title,
						artist: result.artist,
						album: result.album,
					} as Song,
					file_b64: "data:audio/wav;base64," + result.file_b64,
				});
			}
		}
	};

	shouldComponentUpdate(
		nextProps: Readonly<Props>,
		nextState: Readonly<State>,
		nextContext: any,
	): boolean {
		return (
			nextProps.selectedSongId !== this.props.selectedSongId ||
			nextState.file_b64 !== this.state.file_b64 ||
			nextState.addToPlaylistMenu !== this.state.addToPlaylistMenu ||
			nextState.userPlaylists !== this.state.userPlaylists
		);
	}

	handleSelectChange = (event: SelectChangeEvent) => {
		this.setState({ chosenPlaylistId: parseInt(event.target.value) });
	};

	handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (this.props.selectedSongId && this.state.chosenPlaylistId !== -1) {
			let result = await ControllerSongs.addSongToPlaylist(
				this.props.sessionHash,
				this.props.userUuid,
				this.props.selectedSongId,
				this.state.chosenPlaylistId,
			);
			if (result) {
				if (result.is_success) {
					console.log("Added to playlist");
					//	TODO Render message
				}
			} else {
				//	TODO Render message
			}
		} else {
			//	TODO Render message
		}
	};

	render = () => {
		let content;

		let addToPlaylistMenuContent = null;

		if (this.state.addToPlaylistMenu && this.state.userPlaylists) {
			addToPlaylistMenuContent = (
				<form style={{ width: "100%" }} onSubmit={this.handleSubmit}>
					<Grid item pt={2}>
						<Select
							sx={{ width: "100%" }}
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={
								this.state.userPlaylists.length > 0
									? this.state.userPlaylists[0].playlist_id?.toString()
									: ""
							}
							label="Playlists"
							onChange={this.handleSelectChange}
						>
							{this.state.userPlaylists.map((playlist) => {
								if (playlist.playlist_id !== this.props.selectedPlaylistId) {
									return (
										<MenuItem
											value={playlist.playlist_id ? playlist.playlist_id : -1}
											key={playlist.playlist_id ? playlist.playlist_id : -1}
										>
											{playlist.playlist_title}
										</MenuItem>
									);
								}
							})}
						</Select>
					</Grid>
					<Grid item pt={2}>
						<Button type="submit" variant={"contained"}>
							Add
						</Button>
					</Grid>
				</form>
			);
		}

		if (this.props.selectedSongId) {
			content = (
				<Grid container direction={"column"}>
					<Grid item>
						<Typography align={"center"} variant={"h5"}>
							<b>Title:</b> {this.state.song.song_title}
						</Typography>
					</Grid>
					<Grid item>
						<Typography align={"center"} variant={"h5"}>
							<b>Artist:</b> {this.state.song.artist}
						</Typography>
					</Grid>
					<Grid item>
						<Typography align={"center"} variant={"h5"}>
							<b>Album:</b> {this.state.song.album}
						</Typography>
					</Grid>
					<Grid item>
						<audio controls autoPlay src={this.state.file_b64} />
					</Grid>
					<Grid item container direction={"column"}>
						<Grid item pt={2}>
							<Button
								disabled={!this.state.userPlaylists}
								variant={"contained"}
								onClick={() =>
									this.setState({
										addToPlaylistMenu: !this.state.addToPlaylistMenu,
									})
								}
							>
								Add to playlist
							</Button>
						</Grid>
						<Grid item container direction={"column"} alignItems={"center"}>
							{addToPlaylistMenuContent}
						</Grid>
					</Grid>
				</Grid>
			);
		} else {
			content = (
				<Grid container>
					<Grid item justifyContent={"center"}>
						<Typography align={"center"} variant={"h4"}>
							No song is chosen
						</Typography>
					</Grid>
				</Grid>
			);
		}

		return content;
	};
}
