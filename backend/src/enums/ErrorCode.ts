export enum ErrorCode {
	unexpected_error = -1,
	user_already_exists = 1,
	user_does_not_exist = 2,
	password_incorrect = 3,
	wrong_uuid = 4,
	delete_error = 5,
	session_does_not_exist = 11,
	session_invalid = 12,
	session_inactive = 13,
	playlist_already_exists = 21,
	playlist_does_not_exist = 22,
}