import { Body, Controller, Post, Route } from "tsoa";

import Playlist from "../models/Playlist";
import { RequestPlaylistGetAll } from "../messages/RequestPlaylistGetAll";
import { ResponsePlaylistGetAll } from "../messages/ResponsePlaylistGetAll";
import { RequestPlaylistGetUser } from "../messages/RequestPlaylistGetUser";
import { ResponsePlaylistGetUser } from "../messages/ResponsePlaylistGetUser";
import { RequestPlaylistCreate } from "../messages/RequestPlaylistCreate";
import { ResponsePlaylistCreate } from "../messages/ResponsePlaylistCreate";
import { ControllerDatabase } from "./ControllerDatabase";
import { ErrorCode } from "../enums/ErrorCode";
import { ErrorMessage } from "../enums/ErrorMessage";
import { ResponsePlaylistDelete } from "../messages/ResponsePlaylistDelete";
import { RequestPlaylistDelete } from "../messages/RequestPlaylistDelete";
import { ValidateSession } from "../common/ValidateSession";


@Route("playlists")
export class ControllerPlaylists extends Controller {

	@Post("all")
	public async GetAllPlaylists(@Body() request: RequestPlaylistGetAll): Promise<ResponsePlaylistGetAll> {
		const response = {
			playlist_ids: [],
			user_uuids: [],
			titles: [],
			descriptions: [],
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponsePlaylistGetAll;

		console.log("\n__________________________________")
		console.log("GetAllPlaylists")

		try {
			const user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
			if (user && user.user_id) {
				let validation = await ValidateSession(user.user_id, request.session_hash);
				if (validation.result_code === 0) {
					let playlists: Playlist[] = await ControllerDatabase.GetAllPlaylists();
					this.SeparateAndFilterPlaylists(playlists, response);
				} else {
					response.error_code = validation.result_code;
					response.error_msg = validation.result_msg;
				}
			} else {
				response.error_code = ErrorCode.wrong_uuid;
				response.error_msg = ErrorMessage.wrong_uuid;
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		return response;
	}

	@Post("user")
	public async GetUserPlaylists(@Body() request: RequestPlaylistGetUser): Promise<ResponsePlaylistGetUser> {
		const response = {
			playlist_ids: [],
			user_uuids: [],
			titles: [],
			descriptions: [],
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponsePlaylistGetUser;

		console.log("\n__________________________________")
		console.log("GetUserPlaylists")

		try {
			const user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
			if (user && user.user_id) {
				let validation = await ValidateSession(user.user_id, request.session_hash);
				if (validation.result_code === 0) {
					let playlists: Playlist[] = await ControllerDatabase.GetPlaylistsByUserId(user.user_id);
					this.SeparateAndFilterPlaylists(playlists, response);
				} else {
					response.error_code = validation.result_code;
					response.error_msg = validation.result_msg;
				}
			} else {
				response.error_code = ErrorCode.wrong_uuid;
				response.error_msg = ErrorMessage.wrong_uuid;
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		return response;
	}

	@Post("create")
	public async CreatePlaylist(@Body() request: RequestPlaylistCreate): Promise<ResponsePlaylistCreate> {
		const response = {
			playlist_id: 0,
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponsePlaylistCreate;

		console.log("\n__________________________________")
		console.log("CreatePlaylist")

		try {
			const user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
			if (user && user.user_id) {
				let validation = await ValidateSession(user.user_id, request.session_hash);
				if (validation.result_code === 0) {
					let playlists = await ControllerDatabase.GetPlaylistsByUserId(user.user_id);
					let playlist_exists = false;
					for (let p of playlists) {
						if (p.title === request.title) {
							playlist_exists = true;
							break;
						}
					}
					if (!playlist_exists) {
						let playlist_new = {
							user_id: user.user_id,
							user_uuid: request.user_uuid,
							title: request.title,
							description: request.description,
							is_deleted: 0,
							created: Date.now(),
							modified: Date.now(),
						} as Playlist;
						response.playlist_id = await ControllerDatabase.InsertPlaylist(playlist_new);
						response.is_success = true;
					} else {
						response.error_code = ErrorCode.playlist_already_exists;
						response.error_msg = ErrorMessage.playlist_already_exists;
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

	@Post("delete")
	public async DeletePlaylist(@Body() request: RequestPlaylistDelete): Promise<ResponsePlaylistCreate> {
		const response = {
			playlist_id: 0,
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponsePlaylistDelete;

		console.log("\n__________________________________")
		console.log("DeletePlaylist")
		try {
			const user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
			if (user && user.user_id) {
				let validation = await ValidateSession(user.user_id, request.session_hash);
				if (validation.result_code === 0) {
					let playlist = await ControllerDatabase.GetPlaylistById(request.playlist_id);
					if (playlist) {
						let is_success = await ControllerDatabase.DeletePlaylist(request.playlist_id);
						if (is_success) {
							response.playlist_id = request.playlist_id;
							response.is_success = true;
						} else {
							response.error_code = ErrorCode.delete_error;
							response.error_msg = ErrorMessage.delete_error;
						}
					} else {
						response.error_code = ErrorCode.playlist_does_not_exist;
						response.error_msg = ErrorMessage.playlist_does_not_exist;
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

	private SeparateAndFilterPlaylists(playlists: Playlist[], response: ResponsePlaylistGetAll | ResponsePlaylistGetUser): void {
		let playlist_ids: number[] = [];
		let user_uuids: string[] = [];
		let titles: string[] = [];
		let descriptions: string[] = [];

		for (let playlist of playlists) {
			if (playlist.playlist_id && playlist.is_deleted !== 1) {
				playlist_ids.push(playlist.playlist_id);
				user_uuids.push(playlist.user_uuid);
				titles.push(playlist.title);
				descriptions.push(playlist.description);
			}
		}

		response.playlist_ids = playlist_ids;
		response.user_uuids = user_uuids;
		response.titles = titles;
		response.descriptions = descriptions;
		response.is_success = true;
	}

}