export interface RequestPlaylistCreate {
    session_hash: string;
    user_id: string;
    request_hash: string;
    timestamp: number;
    title: string;
    description: string;
}