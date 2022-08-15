import { SecuredRequest } from "./SecuredRequest";

export interface RequestSongAdd extends SecuredRequest {
	playlist_id: number;
	title: string;
	artist: string;
	album: string;
	file_b64: string;
}