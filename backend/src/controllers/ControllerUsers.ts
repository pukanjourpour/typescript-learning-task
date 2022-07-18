import {Body, Controller, Get, Path, Post, Query, Route, SuccessResponse} from "tsoa";
import {User} from "../models/User";
import {RequestUserRegister} from "../messages/RequestUserRegister";
import {ResponseUserRegister} from "../messages/ResponseUserRegister";
import {RequestUserLogin} from "../messages/RequestUserLogin";
import {ResponseUserLogin} from "../messages/ResponseUserLogin";

@Route("users")
export class ControllerUsers extends Controller {

    @Post("register")
    public async Register(@Body() request: RequestUserRegister): Promise<ResponseUserRegister> {
        const response = {
            user_id: "",
            is_success: false
        } as ResponseUserRegister;
        return response;
    }

    @Post("login")
    public async Login(@Body() request: RequestUserLogin): Promise<ResponseUserLogin> {
        const response = {
            user_id: "",
            username: "",
            is_success: false
        } as ResponseUserLogin;

        return response;
    }


}