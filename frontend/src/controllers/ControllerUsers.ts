import { ResponseUserLogin } from "../../../backend/src/messages/ResponseUserLogin";
import { RequestUserLogin } from "../../../backend/src/messages/RequestUserLogin";
import { ResponseUserRegister } from "../../../backend/src/messages/ResponseUserRegister";
import { RequestUserRegister } from "../../../backend/src/messages/RequestUserRegister";
import { ResponseUserGetUsername } from "../../../backend/src/messages/ResponseUserGetUsername";
import { RequestUserGetUsername } from "../../../backend/src/messages/RequestUserGetUsername";
import { axiosPost } from "./common/axiosPost";

export class ControllerUsers {

	public static async login(username: string, password: string): Promise<ResponseUserLogin | null> {
		return await axiosPost<RequestUserLogin, ResponseUserLogin>("http://localhost:3000/users/login",
			{
				request_hash: "some hash",
				timestamp: Date.now(),
				username: username,
				password_hash: password,
			} as RequestUserLogin);
	}

	public static async register(username: string, password: string): Promise<ResponseUserRegister | null> {
		return await axiosPost<RequestUserRegister, ResponseUserRegister>("http://localhost:3000/users/register",
			{
				request_hash: "some hash",
				timestamp: Date.now(),
				username: username,
				password_hash: password,
			} as RequestUserRegister);
	}

	public static async getUsernameByUuid(userUuid: string, sessionHash: string, requestedUuid: string): Promise<ResponseUserGetUsername | null> {
		return await axiosPost<RequestUserGetUsername, ResponseUserGetUsername>("http://localhost:3000/users/get-username",
			{
				requested_user_uuid: requestedUuid,
				session_hash: sessionHash,
				user_uuid: userUuid,
				request_hash: "some hash",
				timestamp: Date.now(),
			} as RequestUserGetUsername);
	}

}