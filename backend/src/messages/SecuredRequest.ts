export interface SecuredRequest {
	user_uuid: string,
	session_hash: string
	request_hash: string;
	timestamp: number;
}