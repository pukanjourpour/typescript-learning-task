import { ResponseUserLogin } from "../../../backend/src/messages/ResponseUserLogin";
import { RequestUserLogin } from "../../../backend/src/messages/RequestUserLogin";
import { ResponseUserRegister } from "../../../backend/src/messages/ResponseUserRegister";
import { RequestUserRegister } from "../../../backend/src/messages/RequestUserRegister";
import { ResponseUserGetUsername } from "../../../backend/src/messages/ResponseUserGetUsername";
import { RequestUserGetUsername } from "../../../backend/src/messages/RequestUserGetUsername";
import { axiosPost } from "./common/axiosPost";

export class ControllerUsers {
	public static async login(
		username: string,
		password: string,
	): Promise<ResponseUserLogin | null> {
		let request: RequestUserLogin = {
			request_hash: "some hash",
			timestamp: Date.now(),
			username: username,
			password_hash: password,
		} as RequestUserLogin;
		return await axiosPost<RequestUserLogin, ResponseUserLogin>(
			"http://localhost:3000/users/login",
			request,
		);
	}

	public static async register(
		username: string,
		password: string,
	): Promise<ResponseUserRegister | null> {
		let request: RequestUserRegister = {
			request_hash: "some hash",
			timestamp: Date.now(),
			username: username,
			password_hash: password,
		} as RequestUserRegister;
		return await axiosPost<RequestUserRegister, ResponseUserRegister>(
			"http://localhost:3000/users/register",
			request,
		);
	}

	public static async getUsernameByUuid(
		userUuid: string,
		sessionHash: string,
		requestedUuid: string,
	): Promise<ResponseUserGetUsername | null> {
		let request: RequestUserGetUsername = {
			requested_user_uuid: requestedUuid,
			session_hash: sessionHash,
			user_uuid: userUuid,
			request_hash: "some hash",
			timestamp: Date.now(),
		} as RequestUserGetUsername;
		return await axiosPost<RequestUserGetUsername, ResponseUserGetUsername>(
			"http://localhost:3000/users/get-username",
			request,
		);
	}
}
