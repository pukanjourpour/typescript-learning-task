export default interface Song {
    song_id: string
    author_id: string
    file_path: string
    title: string
    artist: string
    album: string
    is_deleted: boolean
    created: number
    modified: number
}