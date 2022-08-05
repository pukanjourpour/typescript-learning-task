import Song from "./Song";

export default interface Playlist {
	playlist_id: number | null;
	user_id: number;
	user_uuid: string;
	title: string;
	description: string;
	songs: Song[] | null;
	is_deleted: number;
	created: number;
	modified: number;
}