export interface Session {
    session_id: string
    user_id: string;
    is_active: number;
    session_hash: string;
    is_deleted: number;
    created: number;
    modified: number;
}