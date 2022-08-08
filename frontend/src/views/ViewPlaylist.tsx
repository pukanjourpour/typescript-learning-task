import React from "react";
import Playlist from "../../../backend/src/models/Playlist";
import Song from "../../../backend/src/models/Song";

interface Props {
	selectedPlaylist: Playlist,
	userUuid: string,
	sessionHash: string
}

interface State {
	songs: Song[],
	currentSongId: number
}

export default class ViewPlaylist extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { songs: [], currentSongId: -1 };
	}

	componentDidMount() {

	}

	render() {
		return <h1>playlist</h1>;
	}

}