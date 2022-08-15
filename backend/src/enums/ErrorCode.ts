export enum ErrorCode {
	unexpected_error = -1,
	user_already_exists = 1,
	user_does_not_exist = 2,
	password_incorrect = 3,
	wrong_uuid = 4,
	delete_error = 5,
	session_inactive = 11,
	session_does_not_exist = 12,
	session_invalid = 13,
	playlist_already_exists = 21,
	playlist_does_not_exist = 22,
	song_does_not_exist = 32,
	could_not_load_file = 33,
	could_not_upload_file = 34,
	could_not_add_to_playlist = 35
}