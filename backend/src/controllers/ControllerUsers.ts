import { Body, Controller, Post, Route } from "tsoa";
import User from "../models/User";
import { RequestUserRegister } from "../messages/RequestUserRegister";
import { ResponseUserRegister } from "../messages/ResponseUserRegister";
import { RequestUserLogin } from "../messages/RequestUserLogin";
import { ResponseUserLogin } from "../messages/ResponseUserLogin";
import { ControllerDatabase } from "./ControllerDatabase";
import { ErrorCode } from "../enums/ErrorCode";
import { ErrorMessage } from "../enums/ErrorMessage";
import { v4 as uuidv4 } from "uuid";
import Session from "../models/Session";
import { RequestUserGetUsername } from "../messages/RequestUserGetUsername";
import { ResponseUserGetUsername } from "../messages/ResponseUserGetUsername";
import { ValidateSession } from "../common/ValidateSession";

@Route("users")
export class ControllerUsers extends Controller {

	@Post("register")
	public async Register(@Body() request: RequestUserRegister): Promise<ResponseUserRegister> {
		const response = {
			user_uuid: "",
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponseUserRegister;

		console.log("\n__________________________________")
		console.log("Register")

		try {
			let user_existing = await ControllerDatabase.GetUserByUsername(request.username);
			if (!user_existing) {
				let user_new = {
					user_uuid: uuidv4(),
					username: request.username,
					password_hash: request.password_hash,
					is_deleted: 0,
					created: Date.now(),
					modified: Date.now(),
				} as User;
				await ControllerDatabase.InsertUser(user_new);
				response.user_uuid = user_new.user_uuid;
				response.is_success = true;
			} else {
				response.error_code = ErrorCode.user_already_exists;
				response.error_msg = ErrorMessage.user_already_exists;
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		return response;
	}

	@Post("login")
	public async Login(@Body() request: RequestUserLogin): Promise<ResponseUserLogin> {
		const response = {
			session_hash: "",
			user_uuid: "",
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponseUserLogin;

		console.log("\n__________________________________")
		console.log("Login")

		try {
			let user_existing = await ControllerDatabase.GetUserByUsername(request.username);
			if (user_existing) {
				let user_validated = await ControllerDatabase.GetUserByUsernameAndPassword(request.username, request.password_hash);
				if (user_validated && user_validated.user_id) {
					let session_existing = await ControllerDatabase.GetSessionByUserId(user_validated.user_id);
					if (session_existing && session_existing.is_deleted === 0) {
						session_existing.session_hash = "some new session hash";
						session_existing.is_active = 1;
						session_existing.modified = Date.now();
						await ControllerDatabase.UpdateSession(session_existing);
						response.session_hash = session_existing.session_hash;
					} else {
						let session_new = {
							user_id: user_validated.user_id,
							is_active: 1,
							// TODO
							session_hash: "some session hash",
							is_deleted: 0,
							created: Date.now(),
							modified: Date.now(),
						} as Session;
						await ControllerDatabase.InsertSession(session_new);
						response.session_hash = session_new.session_hash;
					}
					response.user_uuid = user_validated.user_uuid;
					response.is_success = true;
				} else {
					response.error_code = ErrorCode.password_incorrect;
					response.error_msg = ErrorMessage.password_incorrect;
				}
			} else {
				response.error_code = ErrorCode.user_does_not_exist;
				response.error_msg = ErrorMessage.user_does_not_exist;
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}
		return response;
	}

	@Post("get-username")
	public async GetUsernameByUuid(@Body() request: RequestUserGetUsername) {
		let response = {
			username: "",
			is_success: false,
			error_code: 0,
			error_msg: ""
		} as ResponseUserGetUsername;

		console.log("\n__________________________________")
		console.log("GetUsernameByUuid")

		try {
			const user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
			if (user && user.user_id) {
				let validation = await ValidateSession(user.user_id, request.session_hash);
				if (validation.result_code === 0) {
					const requested_user = await ControllerDatabase.GetUserByUuid(request.requested_user_uuid);
						if (requested_user) {
							response.username = requested_user.username;
							response.is_success = true;
						} else {
							response.error_code = ErrorCode.user_does_not_exist;
							response.error_msg = ErrorMessage.user_does_not_exist;
						}
				} else {
					response.error_code = validation.result_code;
					response.error_msg = validation.result_msg;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		return response;

	}

	// TODO: move ValidateSession() to separate file
	// private async ValidateSession(user_id: number, session_hash: string): Promise<{ result_code: number, result_msg: string }> {
	// 	const session_existing = await ControllerDatabase.GetSessionByUserId(user_id);
	// 	let result_code;
	// 	let result_msg;
	// 	if (session_existing) {
	// 		if (session_existing.session_hash === session_hash) {
	// 			if (session_existing.is_active === 1) {
	// 				result_code = 0;
	// 				result_msg = "";
	// 			} else {
	// 				result_code = ErrorCode.session_inactive;
	// 				result_msg = ErrorMessage.session_inactive;
	// 			}
	// 		} else {
	// 			result_code = ErrorCode.session_invalid;
	// 			result_msg = ErrorMessage.session_invalid;
	// 		}
	// 	} else {
	// 		result_code = ErrorCode.session_does_not_exist;
	// 		result_msg = ErrorMessage.session_does_not_exist;
	// 	}
	// 	return { result_code: result_code, result_msg: result_msg };
	// }

}