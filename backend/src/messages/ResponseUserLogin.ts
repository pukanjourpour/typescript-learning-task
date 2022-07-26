export interface ResponseUserLogin {
	session_hash: string;
	user_uuid: string;
	is_success: boolean;
	error_code: number;
	error_msg: string;
}