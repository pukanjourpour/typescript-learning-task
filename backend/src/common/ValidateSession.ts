import { ControllerDatabase } from "../controllers/ControllerDatabase";
import { ErrorCode } from "../enums/ErrorCode";
import { ErrorMessage } from "../enums/ErrorMessage";
import { ResponseGeneric } from "../messages/ResponseGeneric";
import { SecuredRequest } from "../messages/SecuredRequest";

export async function ValidateSession(request: SecuredRequest, response: ResponseGeneric): Promise<number> {
	let validated_user_id = -1;
	let user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
	if (user && user.user_id) {
		const session_existing = await ControllerDatabase.GetSessionByUserId(user.user_id);
		if (session_existing) {
			if (session_existing.session_hash === request.session_hash) {
				if (session_existing.is_active === 1) {
					validated_user_id = user.user_id;
				} else {
					response.error_code = ErrorCode.session_inactive;
					response.error_msg = ErrorMessage.session_inactive;
				}
			} else {
				response.error_code = ErrorCode.session_invalid;
				response.error_msg = ErrorMessage.session_invalid;
			}
		} else {
			response.error_code = ErrorCode.session_does_not_exist;
			response.error_msg = ErrorMessage.session_does_not_exist;
		}
	} else {
		response.error_code = ErrorCode.wrong_uuid;
		response.error_msg = ErrorMessage.wrong_uuid;
	}
	return validated_user_id;
}