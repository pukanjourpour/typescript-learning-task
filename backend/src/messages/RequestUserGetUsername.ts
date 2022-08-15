import { SecuredRequest } from "./SecuredRequest";

export interface RequestUserGetUsername extends SecuredRequest {
	requested_user_uuid: string;
}