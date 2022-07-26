export interface ResponseUserRegister {
	user_uuid: string;
	is_success: boolean;
	error_code: number;
	error_msg: string;
}