export default interface Playlist {
    playlist_id: string;
    user_id: string;
    title: string;
    description: string;
    is_deleted: number;
    created: number;
    modified: number;
}