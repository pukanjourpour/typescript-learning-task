import axios, { AxiosResponse } from "axios";
import { ResponsePlaylistGetAll } from "../../../backend/src/messages/ResponsePlaylistGetAll";
import { RequestPlaylistGetAll } from "../../../backend/src/messages/RequestPlaylistGetAll";
import { ResponsePlaylistGetUser } from "../../../backend/src/messages/ResponsePlaylistGetUser";
import { RequestPlaylistGetUser } from "../../../backend/src/messages/RequestPlaylistGetUser";
import { ResponsePlaylistCreate } from "../../../backend/src/messages/ResponsePlaylistCreate";
import { RequestPlaylistCreate } from "../../../backend/src/messages/RequestPlaylistCreate";
import { ResponsePlaylistDelete } from "../../../backend/src/messages/ResponsePlaylistDelete";
import { RequestPlaylistDelete } from "../../../backend/src/messages/RequestPlaylistDelete";


export class ControllerPlaylists {

	public static async getAllPlaylists(sessionHash: string, userUuid: string): Promise<ResponsePlaylistGetAll | null> {
		let result = null;
		try {
			const response = await axios.post<ResponsePlaylistGetAll>(
				"http://localhost:3000/playlists/all",
				{
					//TODO: create request hash
					session_hash: sessionHash,
					user_uuid: userUuid,
					request_hash: "some hash",
					timestamp: Date.now(),
				} as RequestPlaylistGetAll,
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

	public static async getUserPlaylists(sessionHash: string, userUuid: string): Promise<ResponsePlaylistGetUser | null> {
		let result = null;
		try {
			const response = await axios.post<ResponsePlaylistGetUser>(
				"http://localhost:3000/playlists/user",
				{
					//TODO: create request hash
					session_hash: sessionHash,
					user_uuid: userUuid,
					request_hash: "some hash",
					timestamp: Date.now(),
				} as RequestPlaylistGetUser,
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

	public static async createPlaylist(sessionHash: string, userUuid: string, title: string, description: string): Promise<ResponsePlaylistCreate | null> {
		let result = null;
		try {
			const response = await axios.post<ResponsePlaylistCreate>(
				"http://localhost:3000/playlists/create",
				//TODO: create request hash
				{
					session_hash: sessionHash,
					user_uuid: userUuid,
					request_hash: "some hash",
					timestamp: 0,
					title: title,
					description: description,

				} as RequestPlaylistCreate,
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

	public static async deletePlaylist(sessionHash: string, userUuid: string, playlistId: number): Promise<ResponsePlaylistDelete | null> {
		let result = null;
		try {
			const response = await axios.post<ResponsePlaylistDelete>(
				"http://localhost:3000/playlists/delete",
				//TODO: create request hash
				{
					session_hash: sessionHash,
					user_uuid: userUuid,
					playlist_id: playlistId,
					request_hash: "some hash",
					timestamp: 0,
				} as RequestPlaylistDelete,
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