```mermaid
classDiagram
    direction RL

    User .. ControllerDatabase
    Playlist .. ControllerDatabase
    Song .. ControllerDatabase
    SongsInPlaylist .. ControllerDatabase
    Tag .. ControllerDatabase
    TagsInSong .. ControllerDatabase
        
    ControllerUser ..User
    ControllerPlaylists .. Playlist
    ControllerSongs .. Song
    ControllerSongs .. SongsInPlaylist
    ControllerTags.. Tag
    ControllerTags.. TagsInSong

     ControllerUser .. ControllerDatabase
     ControllerSongs .. ControllerDatabase
     ControllerPlaylists .. ControllerDatabase
     ControllerTags .. ControllerDatabase

    class Server {
        app: Express
        listen()
    }

    class ControllerUser{
        Register(request: RequestUserRegister) ResponseUserRegister
        Login(request: RequestUserLogin) ResponseUserLogin
    }
    
    class ControllerSongs {
        GetAllPlaylistSongs(request: RequestSongGetAllFromPlaylist) ResponseSongGetAllFromPlaylist
        GetSong(request: RequestSongGet) ResponseSongGet
        AddSong(request: RequestSongAdd) ResponseSongAdd
        UpdateSong(request: RequestSongUpdate) ResponseSongUpdate
        DeleteSong(request: RequestSongDelete) ResponseSongDelete
    }
    
    class ControllerPlaylists {
        GetAllPlaylists(request: RequestPlaylistGetAll) ResponsePlaylistGetAll
        GetUserPlaylists(request: RequestPlaylistGetUser) ResponsePlaylistGetUser
        GetPlaylist(request: RequestPlaylistGet) ResponsePlaylistGet
        CreatePlaylist(request: RequestPlaylistCreate) ResponsePlaylistCreate
        UpdatePlaylistInfo(request: RequestPlaylistUpdate) ResponsePlaylistUpdate
        DeletePlaylist(request: RequestPlaylistDelete) ResponsePlaylistDelete
    }
    
    class ControllerTags {
        GetAllTags(request: RequestTagGetAll) ResponseTagGetAll
        GetSongTags(request: RequestTagGetSong) ResponseTagGetSong
        CreateTag(request: RequestTagCreate) ResponseTagCreate
        DeleteTag(request: RequestTagDelete) ResponseTagDelete
    }
    
    class ControllerDatabase{
        CheckApiKeys() void
        GetUserById(userId: string) User
        GetUserByUsername(username: string) User
        GetUserByUsernameAndPassword(username: string, password_hash: string) User
        InsertUser(user: User) void
        UpdateUser(user: User) void
        getAllPlaylists() Playlist[]
        GetPlaylistById(playlistId: string) Playlist
        GetPlaylistsByUserId(userId: string) Playlist[]
        InsertPlaylist(playlist: Playlist) void
        UpdatePlaylist(playlist: Playlist) void
        GetSongById(songId: string) Song
        GetSongsByPlaylistId(playlistId: string) Song
        InsertSong(song: Song) void
        UpdateSong(song: Song) void
        GetAllTags() Tag[]
        GetTagById(tagId: string) Tag
        GetTagsBySongId(songId: string) Tag[]
        InsertTag(tag: Tag) void
        UpdateTag(tag: Tag) void
    }
    
    class Playlist {
        playlist_id: string
        user_id: string
        title: string
        description: string
        is_deleted: boolean
        created: number
        modified: number
    }
    
    class Song {
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
    
    class SongsInPlaylist {
        songs_in_playlist_id: string
        playlist_id: string
        song_id: string
        is_deleted: boolean
        created: number
        modified: number
    }
    
    class Tag {
        tag_id: string
        name: string
        is_deleted: boolean
        created: number
        modified: number
    }
    
    class TagsInSong {
        tags_in_song_id: string
        song_id: string
        tag_id: string
        is_deleted: boolean
        created: number
        modified: number
    }
    
    class User {
        user_id: string
        username: string
        password_hash: string
        api_key: string
        is_deleted: boolean
        created: number
        modified: number
    }
    
    class RequestUserRegiser {
        username: string
        password_hash: string   
    }
    
    class ResponseUserRegister {
        user_id: string
        is_success: boolean
        error_code?: number
        error_msg?: string
    }
    
    class RequestUserLogin {
        username: string
        password_hash: string   
    }
    
    class ResponseUserLogin {
        api_key: string
        user_id: string
        is_success: boolean
        error_code?: number
        error_msg?: string
    }
    
    class RequestSongAdd {
        api_key: string
        timestamp: number
        file: File 
        title: string
        artist: string
        album: string
    }
    
    class ResponseSongAdd {
        song_id: string
        is_success: boolean
        error_code?: number
        error_msg?: string
    }
    
    class RequestPlaylistGetAll {
        access_token: string
        timestamp: number
    }
    
    class ResponsePlaylistGetAll {
        playlist_ids: string[]
        user_ids: string[]
        titles: string[]
        descriptions: string[]
        is_success: boolean
        error_code?: number
        error_msg?: string
    }
    
    class RequestPlaylistUpdate {
        api_key: string
        timestamp: number
        playlist_id: string
        new_title: string
        new_description: string
    }
    
    class ResponsePlaylistUpdate {
        is_success: boolean
        error_code?: number
        error_msg?: string
    }

```