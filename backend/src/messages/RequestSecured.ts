export interface RequestSecured {
	user_uuid: string;
	session_hash: string;
	request_hash: string;
	timestamp: number;
}
