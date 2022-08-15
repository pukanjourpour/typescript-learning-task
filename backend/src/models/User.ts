export default interface User {
	user_id: number | null;
	user_uuid: string;
	username: string;
	password_hash: string;
	user_is_deleted: number;
	user_created: number;
	user_modified: number;
}