export interface ResponsePlaylistGetAll {
	playlist_ids: number[];
	user_uuids: string[];
	titles: string[];
	descriptions: string[];
	is_success: boolean;
	error_code: number;
	error_msg: string;
}