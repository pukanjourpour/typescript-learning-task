import { RequestSecured } from "./RequestSecured";

export interface RequestPlaylistCreate extends RequestSecured {
	title: string;
	description: string;
}
