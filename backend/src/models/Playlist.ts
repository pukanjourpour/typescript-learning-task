import Song from "./Song";

export default interface Playlist {
	playlist_id: number | null;
	playlist_user_id: number;
	playlist_user_uuid: string;
	playlist_title: string;
	description: string;
	songs: Song[] | null;
	playlist_is_deleted: number;
	playlist_created: number;
	playlist_modified: number;
}