import { Body, Controller, Post, Route } from "tsoa";
import { User } from "../models/User";
import { RequestUserRegister } from "../messages/RequestUserRegister";
import { ResponseUserRegister } from "../messages/ResponseUserRegister";
import { RequestUserLogin } from "../messages/RequestUserLogin";
import { ResponseUserLogin } from "../messages/ResponseUserLogin";
import { ControllerDatabase } from "./ControllerDatabase";
import { ErrorCode } from "../enums/ErrorCode";
import { ErrorMessage } from "../enums/ErrorMessage";
import { v4 as uuidv4 } from "uuid";
import { Session } from "../models/Session";

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
							session_id: uuidv4(),
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

}