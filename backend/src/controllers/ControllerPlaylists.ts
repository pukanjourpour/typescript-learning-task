import { Body, Controller, Post, Route } from "tsoa";

import Playlist from "../models/Playlist";
import { RequestPlaylistGetAll } from "../messages/RequestPlaylistGetAll";
import { ResponsePlaylistGetAll } from "../messages/ResponsePlaylistGetAll";
import { RequestPlaylistCreate } from "../messages/RequestPlaylistCreate";
import { ResponsePlaylistCreate } from "../messages/ResponsePlaylistCreate";
import { ControllerDatabase } from "./ControllerDatabase";
import { ErrorCode } from "../enums/ErrorCode";
import { ErrorMessage } from "../enums/ErrorMessage";


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

		try {
			const user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
			if (user && user.user_id) {
				let validation = await this.ValidateSession(user.user_id, request.session_hash);
				if (validation.result_code === 0) {
					let playlists: Playlist[] = await ControllerDatabase.GetAllPlaylists();
					let playlist_ids: number[] = [];
					let user_uuids: string[] = [];
					let titles: string[] = [];
					let descriptions: string[] = [];

					for (let playlist of playlists) {
						if (playlist.playlist_id) {
							playlist_ids.push(playlist.playlist_id);
						} else {
							playlist_ids.push(0);
						}
						user_uuids.push(playlist.user_uuid);
						titles.push(playlist.title);
						descriptions.push(playlist.description);
					}

					response.playlist_ids = playlist_ids;
					response.user_uuids = user_uuids;
					response.titles = titles;
					response.descriptions = descriptions;
					response.is_success = true;
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

		try {
			const user = await ControllerDatabase.GetUserByUuid(request.user_uuid);
			if (user && user.user_id) {
				let validation = await this.ValidateSession(user.user_id, request.session_hash);
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

	public async ValidateSession(user_id: number, session_hash: string): Promise<{ result_code: number, result_msg: string }> {
		const session_existing = await ControllerDatabase.GetSessionByUserId(user_id);
		let result_code;
		let result_msg;
		if (session_existing) {
			if (session_existing.session_hash === session_hash) {
				if (session_existing.is_active === 1) {
					result_code = 0;
					result_msg = "";
				} else {
					result_code = ErrorCode.session_inactive;
					result_msg = ErrorMessage.session_inactive;
				}
			} else {
				result_code = ErrorCode.session_invalid;
				result_msg = ErrorMessage.session_invalid;
			}
		} else {
			result_code = ErrorCode.session_does_not_exist;
			result_msg = ErrorMessage.session_does_not_exist;
		}
		return { result_code: result_code, result_msg: result_msg };
	}

}