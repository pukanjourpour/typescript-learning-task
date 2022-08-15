import { ResponsePlaylistGetAll } from "../../../backend/src/messages/ResponsePlaylistGetAll";
import { RequestPlaylistGetAll } from "../../../backend/src/messages/RequestPlaylistGetAll";
import { ResponsePlaylistGetUser } from "../../../backend/src/messages/ResponsePlaylistGetUser";
import { RequestPlaylistGetUser } from "../../../backend/src/messages/RequestPlaylistGetUser";
import { ResponsePlaylistCreate } from "../../../backend/src/messages/ResponsePlaylistCreate";
import { RequestPlaylistCreate } from "../../../backend/src/messages/RequestPlaylistCreate";
import { ResponsePlaylistDelete } from "../../../backend/src/messages/ResponsePlaylistDelete";
import { RequestPlaylistDelete } from "../../../backend/src/messages/RequestPlaylistDelete";
import { axiosPost } from "./common/axiosPost";


export class ControllerPlaylists {

	public static async getAllPlaylists(sessionHash: string, userUuid: string): Promise<ResponsePlaylistGetAll | null> {
		return await axiosPost<RequestPlaylistGetAll, ResponsePlaylistGetAll>("http://localhost:3000/playlists/all",
			{
				session_hash: sessionHash,
				user_uuid: userUuid,
				request_hash: "some hash",
				timestamp: Date.now(),
			} as RequestPlaylistGetAll);
	}

	public static async getUserPlaylists(sessionHash: string, userUuid: string): Promise<ResponsePlaylistGetUser | null> {
		return await axiosPost<RequestPlaylistGetUser, ResponsePlaylistGetUser>("http://localhost:3000/playlists/user",
			{
				session_hash: sessionHash,
				user_uuid: userUuid,
				request_hash: "some hash",
				timestamp: Date.now(),
			} as RequestPlaylistGetUser);
	}

	public static async createPlaylist(sessionHash: string, userUuid: string, title: string, description: string): Promise<ResponsePlaylistCreate | null> {
		return await axiosPost<RequestPlaylistCreate, ResponsePlaylistCreate>("http://localhost:3000/playlists/create",
			{
				session_hash: sessionHash,
				user_uuid: userUuid,
				request_hash: "some hash",
				timestamp: 0,
				title: title,
				description: description,
			} as RequestPlaylistCreate);
	}

	public static async deletePlaylist(sessionHash: string, userUuid: string, playlistId: number): Promise<ResponsePlaylistDelete | null> {
		return await axiosPost<RequestPlaylistDelete, ResponsePlaylistDelete>("http://localhost:3000/playlists/delete",
			{
				session_hash: sessionHash,
				user_uuid: userUuid,
				playlist_id: playlistId,
				request_hash: "some hash",
				timestamp: 0,
			} as RequestPlaylistDelete);
	}

}