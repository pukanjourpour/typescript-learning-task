import { SecuredRequest } from "./SecuredRequest";

export interface RequestSongAddToPlaylist extends SecuredRequest {
	playlist_id: number;
	song_id: number;
}