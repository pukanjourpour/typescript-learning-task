import { RequestSecured } from "./RequestSecured";

export interface RequestSongDelete extends RequestSecured {
	song_id: number;
}
