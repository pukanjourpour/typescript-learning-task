export default interface SongsInPlaylist {
	songs_in_playlist_id: number | null;
	playlist_id: number;
	song_id: number;
	is_deleted: number;
	created: number;
	modified: number;
}