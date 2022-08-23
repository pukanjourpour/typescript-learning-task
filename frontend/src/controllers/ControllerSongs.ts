import { ResponseSongGet } from "../../../backend/src/messages/ResponseSongGet";
import { RequestSongGet } from "../../../backend/src/messages/RequestSongGet";
import { ResponseSongGetPlaylist } from "../../../backend/src/messages/ResponseSongGetPlaylist";
import { RequestSongGetPlaylist } from "../../../backend/src/messages/RequestSongGetPlaylist";
import { ResponseSongAdd } from "../../../backend/src/messages/ResponseSongAdd";
import { RequestSongAdd } from "../../../backend/src/messages/RequestSongAdd";
import { ResponseSongAddToPlaylist } from "../../../backend/src/messages/ResponseSongAddToPlaylist";
import { RequestSongAddToPlaylist } from "../../../backend/src/messages/RequestSongAddToPlaylist";
import { ResponseSongDelete } from "../../../backend/src/messages/ResponseSongDelete";
import { RequestSongDelete } from "../../../backend/src/messages/RequestSongDelete";
import { axiosPost } from "./common/axiosPost";

export class ControllerSongs {
	public static async addSong(
		sessionHash: string,
		userUuid: string,
		playlistId: number,
		title: string,
		artist: string,
		album: string,
		fileB64: string,
	): Promise<ResponseSongAdd | null> {
		let request: RequestSongAdd = {
			playlist_id: playlistId,
			title: title,
			artist: artist,
			album: album,
			file_b64: fileB64,
			session_hash: sessionHash,
			user_uuid: userUuid,
			request_hash: "some hash",
			timestamp: Date.now(),
		} as RequestSongAdd;
		return await axiosPost<RequestSongAdd, ResponseSongAdd>(
			"http://localhost:3000/songs/add",
			request,
		);
	}

	public static async addSongToPlaylist(
		sessionHash: string,
		userUuid: string,
		songId: number,
		playlistId: number,
	): Promise<ResponseSongAddToPlaylist | null> {
		let request: RequestSongAddToPlaylist = {
			playlist_id: playlistId,
			song_id: songId,
			session_hash: sessionHash,
			user_uuid: userUuid,
			request_hash: "some hash",
			timestamp: Date.now(),
		} as RequestSongAddToPlaylist;
		return await axiosPost<RequestSongAddToPlaylist, ResponseSongAddToPlaylist>(
			"http://localhost:3000/songs/add-to-playlist",
			request,
		);
	}

	public static async getSong(
		sessionHash: string,
		userUuid: string,
		songId: number,
	): Promise<ResponseSongGet | null> {
		let request: RequestSongGet = {
			song_id: songId,
			session_hash: sessionHash,
			user_uuid: userUuid,
			request_hash: "some hash",
			timestamp: Date.now(),
		} as RequestSongGet;
		return await axiosPost<RequestSongGet, ResponseSongGet>(
			"http://localhost:3000/songs/get-one",
			request,
		);
	}

	public static async deleteSong(
		sessionHash: string,
		userUuid: string,
		songId: number,
	): Promise<ResponseSongDelete | null> {
		let request: RequestSongDelete = {
			song_id: songId,
			session_hash: sessionHash,
			user_uuid: userUuid,
			request_hash: "some hash",
			timestamp: Date.now(),
		} as RequestSongDelete;
		return await axiosPost<RequestSongDelete, ResponseSongDelete>(
			"http://localhost:3000/songs/delete",
			request,
		);
	}

	public static async getPlaylistSongs(
		sessionHash: string,
		userUuid: string,
		playlistId: number,
	): Promise<ResponseSongGetPlaylist | null> {
		let request: RequestSongGetPlaylist = {
			playlist_id: playlistId,
			session_hash: sessionHash,
			user_uuid: userUuid,
			request_hash: "some hash",
			timestamp: Date.now(),
		} as RequestSongGetPlaylist;
		return await axiosPost<RequestSongGetPlaylist, ResponseSongGetPlaylist>(
			"http://localhost:3000/songs/get",
			request,
		);
	}
}
