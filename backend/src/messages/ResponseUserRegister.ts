import { ResponseGeneric } from "./ResponseGeneric";

export interface ResponseUserRegister extends ResponseGeneric {
	user_uuid: string;
}