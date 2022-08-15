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
import { getLogger } from "log4js";

const logger = getLogger("ControllerPlaylists");
logger.level = "info"

@Route("playlists")
export class ControllerPlaylists extends Controller {

	@Post("all")
	public async GetAllPlaylists(@Body() request: RequestPlaylistGetAll): Promise<ResponsePlaylistGetAll> {
		const response = {
			playlists: [],
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponsePlaylistGetAll;

		logger.info("Requested: GetAllPlaylists")

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let playlists = await ControllerDatabase.GetAllPlaylists();
				if (playlists) {
					response.playlists = playlists;
					response.is_success = true;
				} else {
					response.error_code = ErrorCode.unexpected_error;
					response.error_msg = ErrorMessage.unexpected_error;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n")
		}

		return response;
	}

	@Post("user")
	public async GetUserPlaylists(@Body() request: RequestPlaylistGetUser): Promise<ResponsePlaylistGetUser> {
		const response = {
			playlists: [],
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponsePlaylistGetUser;

		logger.info("Requested: GetUserPlaylists")

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let playlists = await ControllerDatabase.GetPlaylistsByUserId(validated_user_id);
				if (playlists) {
					response.playlists = playlists;
					response.is_success = true;
				} else {
					response.error_code = ErrorCode.unexpected_error;
					response.error_msg = ErrorMessage.unexpected_error;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n")
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

		logger.info("Requested: CreatePlaylist")

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let playlists = await ControllerDatabase.GetPlaylistsByUserId(validated_user_id);
				let playlist_exists = null;
				for (let playlist of playlists) {
					if (playlist.playlist_title === request.title) {
						playlist_exists = playlist;
						break;
					}
				}
				if (!playlist_exists) {
					let playlist_new = {
						playlist_user_id: validated_user_id,
						playlist_user_uuid: request.user_uuid,
						playlist_title: request.title,
						description: request.description,
						playlist_is_deleted: 0,
						playlist_created: Date.now(),
						playlist_modified: Date.now(),
					} as Playlist;
					let playlist_id = await ControllerDatabase.InsertPlaylist(playlist_new);
					if (playlist_id !== -1) {
						response.playlist_id = playlist_id;
						response.is_success = true;
					} else {
						response.error_code = ErrorCode.unexpected_error;
						response.error_msg = ErrorMessage.unexpected_error;
					}
				} else {
					response.error_code = ErrorCode.playlist_already_exists;
					response.error_msg = ErrorMessage.playlist_already_exists;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n")
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

		logger.info("Requested: DeletePlaylist")
		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
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
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n")
		}

		return response;
	}
}