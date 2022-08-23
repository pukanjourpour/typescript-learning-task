import { Body, Controller, Post, Route } from "tsoa";
import { RequestSongGetPlaylist } from "../messages/RequestSongGetPlaylist";
import { ResponseSongGetPlaylist } from "../messages/ResponseSongGetPlaylist";
import { ValidateSession } from "../common/ValidateSession";
import { ControllerDatabase } from "./ControllerDatabase";
import { ErrorCode } from "../enums/ErrorCode";
import { ErrorMessage } from "../enums/ErrorMessage";
import Song from "../models/Song";
import { RequestSongAdd } from "../messages/RequestSongAdd";
import { ResponseSongAdd } from "../messages/ResponseSongAdd";
import { ResponseSongGet } from "../messages/ResponseSongGet";
import { RequestSongGet } from "../messages/RequestSongGet";
import uniqueFilename from "unique-filename";
import * as fs from "fs/promises";
import SongsInPlaylist from "../models/SongsInPlaylist";
import { RequestSongDelete } from "../messages/RequestSongDelete";
import { ResponseSongDelete } from "../messages/ResponseSongDelete";
import { ResponseSongAddToPlaylist } from "../messages/ResponseSongAddToPlaylist";
import { RequestSongAddToPlaylist } from "../messages/RequestSongAddToPlaylist";
import { getLogger } from "log4js";

const logger = getLogger("ControllerSongs");
logger.level = "info";

@Route("songs")
export class ControllerSongs extends Controller {
	@Post("get")
	public async GetPlaylistSongs(@Body() request: RequestSongGetPlaylist) {
		const response = {
			songs: [],
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponseSongGetPlaylist;

		logger.info("Requested: GetPlaylistSongs");

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let songs = await ControllerDatabase.GetSongsByPlaylistId(request.playlist_id);
				if (songs) {
					response.songs = songs;
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
			logger.info("Request fulfilled successfully\n");
		}

		return response;
	}

	@Post("get-one")
	public async GetSong(@Body() request: RequestSongGet) {
		const response = {
			title: "",
			artist: "",
			album: "",
			file_b64: "",
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponseSongGet;

		logger.info("Requested: GetSong");

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let song = await ControllerDatabase.GetSongById(request.song_id);
				if (song) {
					try {
						let buffer = await fs.readFile(song.file_path, { encoding: "binary" });
						response.title = song.song_title;
						response.artist = song.artist;
						response.album = song.album;
						response.file_b64 = Buffer.from(buffer, "binary").toString("base64");
						response.is_success = true;
					} catch (err) {
						console.log(err);
						response.error_code = ErrorCode.could_not_load_file;
						response.error_msg = ErrorMessage.could_not_load_file;
					}
				} else {
					response.error_code = ErrorCode.song_does_not_exist;
					response.error_msg = ErrorMessage.song_does_not_exist;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n");
		}

		return response;
	}

	@Post("add")
	public async AddSong(@Body() request: RequestSongAdd) {
		const response = {
			song_id: -1,
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponseSongAdd;

		logger.info("Requested: AddSong");

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let decoded = Buffer.from(request.file_b64, "base64");
				let file_path: string =
					uniqueFilename(
						"C:/Users/pukanjourpour/WebstormProjects/typescript-learning-task/backend/database/music",
					) + ".wav";
				let file_uploaded = false;
				try {
					await fs.writeFile(file_path, decoded);
					file_uploaded = true;
				} catch (err) {
					logger.error(err.message);
				}
				if (file_uploaded) {
					let song = {
						song_user_id: validated_user_id,
						song_user_uuid: request.user_uuid,
						file_path: file_path,
						song_title: request.title,
						artist: request.artist,
						album: request.album,
						song_is_deleted: 0,
						song_created: Date.now(),
						song_modified: Date.now(),
					} as Song;
					let song_id = await ControllerDatabase.InsertSong(song);
					if (song_id !== -1) {
						let sip = {
							sip_playlist_id: request.playlist_id,
							sip_song_id: song_id,
							sip_is_deleted: 0,
							sip_created: Date.now(),
							sip_modified: Date.now(),
						} as SongsInPlaylist;

						let result = await ControllerDatabase.AddSongToPlaylist(sip);
						if (result) {
							response.song_id = song_id;
							response.is_success = true;
						} else {
							response.error_code = ErrorCode.could_not_add_to_playlist;
							response.error_msg = ErrorMessage.could_not_add_to_playlist;
						}
					} else {
						response.error_code = ErrorCode.unexpected_error;
						response.error_msg = ErrorMessage.unexpected_error;
					}
				} else {
					response.error_code = ErrorCode.could_not_upload_file;
					response.error_msg = ErrorMessage.could_not_upload_file;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n");
		}

		return response;
	}

	@Post("add-to-playlist")
	public async AddSongToPlaylist(@Body() request: RequestSongAddToPlaylist) {
		const response = {
			song_id: -1,
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponseSongAddToPlaylist;

		logger.info("Requested: AddSongToPlaylist");

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let original_song = await ControllerDatabase.GetSongById(request.song_id);
				if (original_song) {
					let new_song = {
						song_user_id: validated_user_id,
						song_user_uuid: request.user_uuid,
						file_path: original_song.file_path,
						song_title: original_song.song_title,
						artist: original_song.artist,
						album: original_song.album,
						song_is_deleted: 0,
						song_created: Date.now(),
						song_modified: Date.now(),
					} as Song;
					let new_song_id = await ControllerDatabase.InsertSong(new_song);
					if (new_song_id !== -1) {
						let sip = {
							sip_playlist_id: request.playlist_id,
							sip_song_id: new_song_id,
							sip_is_deleted: 0,
							sip_created: Date.now(),
							sip_modified: Date.now(),
						} as SongsInPlaylist;
						let result = await ControllerDatabase.AddSongToPlaylist(sip);
						if (result) {
							response.is_success = true;
						} else {
							response.error_code = ErrorCode.could_not_add_to_playlist;
							response.error_msg = ErrorMessage.could_not_add_to_playlist;
						}
					} else {
						response.error_code = ErrorCode.unexpected_error;
						response.error_msg = ErrorMessage.unexpected_error;
					}
				} else {
					response.error_code = ErrorCode.song_does_not_exist;
					response.error_msg = ErrorMessage.song_does_not_exist;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n");
		}

		return response;
	}

	@Post("delete")
	public async DeleteSong(@Body() request: RequestSongDelete) {
		const response = {
			song_id: -1,
			is_success: false,
			error_code: 0,
			error_msg: "",
		} as ResponseSongDelete;

		logger.info("Requested: DeleteSong");

		try {
			let validated_user_id = await ValidateSession(request, response);
			if (validated_user_id !== -1) {
				let is_success = await ControllerDatabase.DeleteSong(request.song_id);
				if (is_success) {
					response.song_id = request.song_id;
					response.is_success = true;
				} else {
					response.error_code = ErrorCode.delete_error;
					response.error_msg = ErrorMessage.delete_error;
				}
			}
		} catch (err) {
			response.error_code = ErrorCode.unexpected_error;
			response.error_msg = ErrorMessage.unexpected_error;
		}

		if (!response.is_success) {
			logger.error(`${response.error_msg} (error code: ${response.error_code})\n`);
		} else {
			logger.info("Request fulfilled successfully\n");
		}

		return response;
	}
}
