export default interface Song {
    song_id: string;
    user_id: string;
    file_path: string;
    title: string;
    artist: string;
    album: string;
    is_deleted: number;
    created: number;
    modified: number;
}