import { ResponseGeneric } from "./ResponseGeneric";

export interface ResponseSongDelete extends ResponseGeneric {
	song_id: number;
}
