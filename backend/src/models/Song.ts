export default interface Song {
	song_id: number | null;
	user_id: number;
	user_uuid: string;
	file_path: string;
	title: string;
	artist: string;
	album: string;
	is_deleted: number;
	created: number;
	modified: number;
}