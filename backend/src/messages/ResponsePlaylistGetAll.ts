import { ResponseGeneric } from "./ResponseGeneric";
import Playlist from "../models/Playlist";

export interface ResponsePlaylistGetAll extends ResponseGeneric {
	playlists: Playlist[]
}