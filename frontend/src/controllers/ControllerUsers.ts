import axios from "axios";
import { ResponseUserLogin } from "../messages/ResponseUserLogin";
import { RequestUserLogin } from "../messages/RequestUserLogin";

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

}