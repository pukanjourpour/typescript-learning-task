import { RequestSecured } from "./RequestSecured";

export interface RequestUserGetUsername extends RequestSecured {
	requested_user_uuid: string;
}
