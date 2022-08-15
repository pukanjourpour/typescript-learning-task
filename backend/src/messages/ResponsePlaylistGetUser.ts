import { ResponseGeneric } from "./ResponseGeneric";
import Playlist from "../models/Playlist";

export interface ResponsePlaylistGetUser extends ResponseGeneric {
	playlists: Playlist[]
}