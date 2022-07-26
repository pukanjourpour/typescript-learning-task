export default interface Playlist {
	playlist_id: number | null;
	user_id: number;
	user_uuid: string;
	title: string;
	description: string;
	is_deleted: number;
	created: number;
	modified: number;
}