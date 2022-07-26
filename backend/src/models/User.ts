export interface User {
	user_id: number | null;
	user_uuid: string;
	username: string;
	password_hash: string;
	is_deleted: number;
	created: number;
	modified: number;
}