import axios from "axios";
import {ResponseUserLogin} from "../../../backend/src/messages/ResponseUserLogin";
import {RequestUserLogin} from "../../../backend/src/messages/RequestUserLogin";
import {ResponseUserRegister} from "../../../backend/src/messages/ResponseUserRegister";
import {RequestUserRegister} from "../../../backend/src/messages/RequestUserRegister";
import {ResponseUserGetUsername} from "../../../backend/src/messages/ResponseUserGetUsername";
import {RequestUserGetUsername} from "../../../backend/src/messages/RequestUserGetUsername";

export class ControllerUsers {

	public static async login(username: string, password: string): Promise<ResponseUserLogin | null> {
		let result = null;
		try {
			const response = await axios.post<ResponseUserLogin>(
				"http://localhost:3000/users/login",
				{
					//TODO: create request hash
					request_hash: "some hash",
					timestamp: Date.now(),
					username: username,
					password_hash: password,
				} as RequestUserLogin,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				},
			);
			result = response.data;
		} catch (err) {
			console.log(err);
		}
		return result;
	}

	public static async register(username: string, password: string): Promise<ResponseUserRegister | null> {
		let result = null;
		try {
			const response = await axios.post<ResponseUserRegister>(
				"http://localhost:3000/users/register",
				{
					//TODO: create request hash
					request_hash: "some hash",
					timestamp: Date.now(),
					username: username,
					password_hash: password,
				} as RequestUserRegister,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				},
			);
			result = response.data;
		} catch (err) {
			console.log(err);
		}
		return result;
	}

	public static async getUsernameByUuid(user_uuid: string, session_hash: string, requested_uuid: string): Promise<ResponseUserGetUsername | null> {
		let result = null;
		try {
			const response = await axios.post<ResponseUserGetUsername>(
				"http://localhost:3000/users/get/username",
				{
					//TODO: create request hash
					requested_user_uuid: requested_uuid,
					session_hash: session_hash,
					user_uuid: user_uuid,
					request_hash: "some hash",
					timestamp: Date.now(),
				} as RequestUserGetUsername,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				},
			);
			result = response.data;
		} catch (err) {
			console.log(err);
		}
		return result;
	}

}