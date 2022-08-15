import { SecuredRequest } from "./SecuredRequest";

export interface RequestSongDelete extends SecuredRequest {
	song_id: number;
}