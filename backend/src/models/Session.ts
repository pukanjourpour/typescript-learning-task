export default interface Session {
	session_id: number | null;
	session_user_id: number;
	is_active: number;
	session_hash: string;
	session_is_deleted: number;
	session_created: number;
	session_modified: number;
}
