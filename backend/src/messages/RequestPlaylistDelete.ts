import { SecuredRequest } from "./SecuredRequest";

export interface RequestPlaylistDelete extends SecuredRequest {
	playlist_id: number;
}