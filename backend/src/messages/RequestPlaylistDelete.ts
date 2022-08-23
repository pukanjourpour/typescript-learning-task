import { RequestSecured } from "./RequestSecured";

export interface RequestPlaylistDelete extends RequestSecured {
	playlist_id: number;
}
