import { ResponseGeneric } from "./ResponseGeneric";

export interface ResponseUserLogin extends ResponseGeneric {
	session_hash: string;
	user_uuid: string;
}