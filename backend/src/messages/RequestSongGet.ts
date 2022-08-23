import { RequestSecured } from "./RequestSecured";

export interface RequestSongGet extends RequestSecured {
	song_id: number;
}
