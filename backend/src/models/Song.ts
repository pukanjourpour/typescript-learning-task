export default interface Song {
	song_id: number | null;
	song_user_id: number;
	song_user_uuid: string;
	file_path: string;
	song_title: string;
	artist: string;
	album: string;
	song_is_deleted: number;
	song_created: number;
	song_modified: number;
}
