import {Body, Controller, Post, Route} from "tsoa";
import {RequestPlaylistsGetAll} from "../messages/RequestPlaylistsGetAll";
import {ResponsePlaylistGetAll} from "../messages/ResponsePlaylistGetAll";
import {ControllerDatabase} from "./ControllerDatabase";
import Playlist from "../models/Playlist";
import {ErrorCode} from "../enums/ErrorCode";
import {ErrorMessage} from "../enums/ErrorMessage";
import {RequestPlaylistCreate} from "../messages/RequestPlaylistCreate";
import {ResponsePlaylistCreate} from "../messages/ResponsePlaylistCreate";
import {v4 as uuidv4} from 'uuid';


@Route("playlists")
export class ControllerPlaylists extends Controller {

    @Post("all")
    public async GetAllPlaylists(@Body() request: RequestPlaylistsGetAll): Promise<ResponsePlaylistGetAll> {
        const response = {
            playlist_ids: [''],
            user_ids: [''],
            titles: [''],
            descriptions: [''],
            is_success: false,
            error_code: 0,
            error_msg: ""
        };

        try {
            let validation = await this.ValidateSession(request.user_id, request.session_hash)
                    if (validation.result_code === 0) {
                        let playlists: Playlist[] = await ControllerDatabase.GetAllPlaylists();
                        let playlist_ids: string[] = [];
                        let user_ids: string[] = [];
                        let titles: string[] = [];
                        let descriptions: string[] = [];

                        playlists.forEach(p => {
                            playlist_ids.push(p.playlist_id);
                            user_ids.push(p.user_id);
                            titles.push(p.title);
                            descriptions.push(p.description);
                        })

                        response.playlist_ids = playlist_ids;
                        response.user_ids = user_ids;
                        response.titles = titles;
                        response.descriptions = descriptions;
                        response.is_success = true;
                    } else {
                        response.error_code = validation.result_code;
                        response.error_msg = validation.result_msg;
                    }
        } catch(err) {
            response.error_code = ErrorCode.unexpected_error;
            response.error_msg = ErrorMessage.unexpected_error;
        }

        return response;
    }

    @Post("create")
    public async CreatePlaylist(@Body() request: RequestPlaylistCreate): Promise<ResponsePlaylistCreate> {
        const response = {
            playlist_id: "",
            is_success: false,
            error_code: 0,
            error_msg: "",
        } as ResponsePlaylistCreate;


        // check session
        // check if user already has a playlist with such title
        // create playlist

        try {
            let validation = await this.ValidateSession(request.user_id, request.session_hash)
            if (validation.result_code === 0) {
                let playlists = await ControllerDatabase.GetPlaylistsByUserId(request.user_id)
                let playlist_exists = false
                for (let p of playlists) {
                    if (p.title === request.title) {
                        playlist_exists = true;
                        break;
                    }
                }
                if (!playlist_exists) {
                    let playlist_new = {
                        playlist_id: uuidv4(),
                        user_id: request.user_id,
                        title: request.title,
                        description: request.description,
                        is_deleted: 0,
                        created: Date.now(),
                        modified: Date.now()
                    } as Playlist;
                    await ControllerDatabase.InsertPlaylist(playlist_new)
                    response.playlist_id = playlist_new.playlist_id;
                    response.is_success = true;
                } else {
                    response.error_code = ErrorCode.playlist_already_exists;
                    response.error_msg = ErrorMessage.playlist_already_exists;
                }
            } else {
                response.error_code = validation.result_code;
                response.error_msg = validation.result_msg;
            }
        } catch(err) {
            response.error_code = ErrorCode.unexpected_error;
            response.error_msg = ErrorMessage.unexpected_error;
        }

        return response;
    }

    public async ValidateSession(user_id: string, session_hash: string): Promise<{result_code: number, result_msg: string}> {
        return ControllerDatabase.GetSessionByUserId(user_id).then((session_existing) => {
            let result_code;
            let result_msg;
            if (session_existing) {
                if (session_existing.session_hash === session_hash) {
                    if (session_existing.is_active === 1) {
                        result_code = 0;
                        result_msg = '';
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
            return {result_code: result_code, result_msg: result_msg};
        })
    }

}