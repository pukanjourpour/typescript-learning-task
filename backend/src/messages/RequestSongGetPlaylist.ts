import { SecuredRequest } from "./SecuredRequest";

export interface RequestSongGetPlaylist extends SecuredRequest {
	playlist_id: number
}