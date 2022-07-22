import {Body, Controller, Get, Path, Post, Query, Route, SuccessResponse} from "tsoa";
import {User} from "../models/User";
import {RequestUserRegister} from "../messages/RequestUserRegister";
import {ResponseUserRegister} from "../messages/ResponseUserRegister";
import {RequestUserLogin} from "../messages/RequestUserLogin";
import {ResponseUserLogin} from "../messages/ResponseUserLogin";
import {ControllerDatabase} from "./ControllerDatabase";
import {v4 as uuidv4} from 'uuid';

@Route("users")
export class ControllerUsers extends Controller {

    // error codes:
    // 0: success
    // -1: failed to connect to database
    // 2: user already exists
    // 3: user does not exist
    // 4: password is not correct

    @Post("register")
    public async Register(@Body() request: RequestUserRegister): Promise<ResponseUserRegister> {
        const response = {
            user_id: "",
            is_success: false,
            error_code: 0,
            error_msg: ""
        } as ResponseUserRegister;

        let newUser;
        await ControllerDatabase.GetUserByUsername(request.username)
            .then((result) => {
                if (!result.user) {
                    newUser = {
                        user_id: uuidv4(),
                        username: request.username,
                        password_hash: request.password_hash,
                        is_deleted: 0,
                        created: Date.now(),
                        modified: Date.now()
                    } as User;
                    return ControllerDatabase.InsertUser(newUser);
                } else {
                    return {user: null, status: 2}
                }
            })
            .then((result) => {
                if (result.status === 2) {
                    response.error_code = result.status;
                    response.error_msg = "User already exists";
                } else if (result.status === 0) {
                    response.user_id = newUser.user_id;
                    response.is_success = true;
                    response.error_code = result.status;
                    response.error_msg = "";
                } else if (result.status === -1) {
                    response.error_code = result.status;
                    response.error_msg = "Failed to connect to database";
                }
            }, (err) => {
                console.log(err);
            });
        return response;
    }

    @Post("login")
    public async Login(@Body() request: RequestUserLogin): Promise<ResponseUserLogin> {
        const response = {
            session_hash: "",
            user_id: "",
            is_success: false,
            error_code: 0,
            error_msg: ""
        } as ResponseUserLogin;

        try {
            await ControllerDatabase.GetUserByUsername(request.username)
                .then((result) => {
                    if (result.status === 0) {
                        return ControllerDatabase.GetUserByUsernameAndPassword(request.username, request.password_hash);
                    } else {
                        if (result.status === -1) {
                            response.error_code = result.status;
                            response.error_msg = "Failed to connect to database";
                            throw new Error("Failed to connect to database");
                        } else if (result.status === 3) {
                            response.error_code = result.status;
                            response.error_msg = "User does not exist";
                            throw new Error("User does not exist");
                        } else {
                            throw new Error("Unknown error")
                        }
                    }
                })
                .then((result) => {
                    if (result.status === 0 && result.user) {
                        let session = {
                            session_id: uuidv4(),
                            user_id: result.user.user_id,
                            is_active: 1,
                            session_hash: "some session hash",
                            is_deleted: 0,
                            created: Date.now(),
                            modified: Date.now()
                        }
                        return ControllerDatabase.InsertSession(session);
                    } else {
                        if (result.status === -1) {
                            response.error_code = result.status;
                            response.error_msg = "Failed to connect to database";
                            throw new Error("Failed to connect to database");
                        } else if (result.status === 4) {
                            response.error_code = result.status;
                            response.error_msg = "Password is incorrect";
                            throw new Error("Password is incorrect");
                        } else {
                            throw new Error("Unknown error")
                        }
                    }
                })
                .then((result) => {
                    if (result.status === -1) {
                        response.error_code = result.status;
                        response.error_msg = "Failed to connect to database";
                    } else if (result.status === 0 && result.session) {
                        response.session_hash = result.session.session_hash;
                        response.user_id = result.session.user_id;
                        response.is_success = true;
                        response.error_code = result.status;
                        response.error_msg = "";
                    }
                });
        } catch (err: any) {
            console.log(err.message)
        }

        return response;
    }

}