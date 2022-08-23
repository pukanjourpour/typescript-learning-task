import { RequestSecured } from "./RequestSecured";

export interface RequestSongGetPlaylist extends RequestSecured {
	playlist_id: number;
}
