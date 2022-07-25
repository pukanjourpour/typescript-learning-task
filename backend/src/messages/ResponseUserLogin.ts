export interface ResponseUserLogin {
    session_hash: string
    user_id: string;
    is_success: boolean;
    error_code: number;
    error_msg: string;
}