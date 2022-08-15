import { SecuredRequest } from "./SecuredRequest";

export interface RequestSongGet extends SecuredRequest {
	song_id: number;
}