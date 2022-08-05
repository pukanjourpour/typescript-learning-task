export interface RequestPlaylistDelete {
	session_hash: string;
	user_uuid: string;
	playlist_id: number;
	request_hash: string;
	timestamp: number;
}