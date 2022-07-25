export interface ResponsePlaylistGetAll {
    playlist_ids: string[];
    user_ids: string[];
    titles: string[];
    descriptions: string[];
    is_success: boolean;
    error_code: number;
    error_msg: string;
}