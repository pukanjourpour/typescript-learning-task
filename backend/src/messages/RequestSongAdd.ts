import { RequestSecured } from "./RequestSecured";

export interface RequestSongAdd extends RequestSecured {
	playlist_id: number;
	title: string;
	artist: string;
	album: string;
	file_b64: string;
}
