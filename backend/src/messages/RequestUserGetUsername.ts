export interface RequestUserGetUsername {
	requested_user_uuid: string
	session_hash: string;
	user_uuid: string;
	request_hash: string;
	timestamp: number;
}