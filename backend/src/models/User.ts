export interface User {
    user_id: string;
    username: string;
    password_hash: string;
    is_deleted: number;
    created: number;
    modified: number;
}