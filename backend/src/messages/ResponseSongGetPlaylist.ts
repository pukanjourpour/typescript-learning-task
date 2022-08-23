import { ResponseGeneric } from "./ResponseGeneric";
import Song from "../models/Song";

export interface ResponseSongGetPlaylist extends ResponseGeneric {
	songs: Song[];
}
