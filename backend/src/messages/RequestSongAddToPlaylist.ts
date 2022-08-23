import { RequestSecured } from "./RequestSecured";

export interface RequestSongAddToPlaylist extends RequestSecured {
	playlist_id: number;
	song_id: number;
}
