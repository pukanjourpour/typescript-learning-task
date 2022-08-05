import { ControllerDatabase } from "../controllers/ControllerDatabase";
import { ErrorCode } from "../enums/ErrorCode";
import { ErrorMessage } from "../enums/ErrorMessage";

export async function ValidateSession(user_id: number, session_hash: string): Promise<{ result_code: number, result_msg: string }> {
	const session_existing = await ControllerDatabase.GetSessionByUserId(user_id);
	let result_code;
	let result_msg;
	if (session_existing) {
		if (session_existing.session_hash === session_hash) {
			if (session_existing.is_active === 1) {
				result_code = 0;
				result_msg = "";
			} else {
				result_code = ErrorCode.session_inactive;
				result_msg = ErrorMessage.session_inactive;
			}
		} else {
			result_code = ErrorCode.session_invalid;
			result_msg = ErrorMessage.session_invalid;
		}
	} else {
		result_code = ErrorCode.session_does_not_exist;
		result_msg = ErrorMessage.session_does_not_exist;
	}
	return { result_code: result_code, result_msg: result_msg };
}