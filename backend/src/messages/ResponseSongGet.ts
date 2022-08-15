import { ResponseGeneric } from "./ResponseGeneric";

export interface ResponseSongGet extends ResponseGeneric {
	title: string,
	artist: string,
	album: string,
	file_b64: string;
}