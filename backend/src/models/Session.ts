export default interface Session {
	session_id: number | null;
	user_id: number;
	is_active: number;
	session_hash: string;
	is_deleted: number;
	created: number;
	modified: number;
}