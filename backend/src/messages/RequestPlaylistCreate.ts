import { SecuredRequest } from "./SecuredRequest";

export interface RequestPlaylistCreate extends SecuredRequest {
	title: string;
	description: string;
}