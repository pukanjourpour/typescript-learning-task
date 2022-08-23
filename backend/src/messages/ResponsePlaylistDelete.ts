import { ResponseGeneric } from "./ResponseGeneric";

export interface ResponsePlaylistDelete extends ResponseGeneric {
	playlist_id: number;
}
