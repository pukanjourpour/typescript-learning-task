```mermaid
classDiagram
    direction RL

    User .. ControllerDatabase
    Playlist .. ControllerDatabase
    Song .. ControllerDatabase
    Tag .. ControllerDatabase
    TagsInSong .. ControllerDatabase
    
    ControllerUser ..User
    ControllerPlaylists .. Playlist
    ControllerSongs .. Song
    ControllerTags.. Tag
    ControllerTags.. TagsInSong

     ControllerUser --> ControllerDatabase
     ControllerSongs --> ControllerDatabase
     ControllerPlaylists --> ControllerDatabase
     ControllerTags --> ControllerDatabase

    class Server {
        app: Express
        listen()
    }

    class ControllerUser{
        Register(request: UserRegisterRequest)
        Login(request: UserLoginRequest)
        UpdateUserInfo(request: UserUpdateRequest)
    }
    
    class ControllerSongs {
        GetAllSongs(request: RequestSongGetAll)
        GetSong(request: RequestSongGet)
        AddSong(request: RequestSongAdd)
        SetSongTags(request: RequestSongSetTags)
        UpdateSongInfo(request: RequestSongUpdate)
        RemoveSongTags(request: RequestSongRemoveTags)
        DeleteSong(request: RequestSongDelete)
    }
    
    class ControllerPlaylists {
        GetAllPlaylists(request: RequestPlaylistGetAll)
        GetPlaylist(request: RequestPlaylistGet)
        AddSong(request: RequestPlaylistAddSong)
        MoveSongToAnotherPlaylist(request: RequestPlaylistMoveSong)
        RemoveSong(request: RequestPlaylistRemoveSong)
        CreatePlaylist(request: RequestPlaylistCreate)
        UpdatePlaylistInfo(request: RequestPlaylistUpdate)
        DeletePlaylist(request: RequestPlaylistDelete)
    }
    
    class ControllerTags {
        GetAllTags(request: RequestTagGetAll)
        GetSongTags(request: RequestTagGetSong)
        CreateTag(request: RequestTagCreate)
        DeleteTag(request: RequestTagDelete)
    }
    
    class ControllerDatabase{
        GetUserById()
        GetUserByUsername()
        GetUserByUsernameAndPassword()
        InsertUser()
        UpdateUser()
        getAllPlaylists()
        GetPlaylistById()
        GetPlaylistsByUserId()
        InsertPlaylist()
        UpdatePlaylist()
        GetAllSongs()
        GetSongById()
        GetSongsByPlaylistId()
        InsertSong()
        UpdateSong()
        GetAllTags()
        GetTagById()
        GetTagsBySongId()
        InsertTag()
        UpdateTag()
    }
    
    class Playlist {
        playlist_id: string
        user_id: string
        title: string
        description: string
    }
    
    class Song {
        song_id: string
        playlist_id: string
        file_path: string
        title: string
        author: string
        album: string
        description: string
        tags_in_song_id: string
    }
    
    class Tag {
        tag_id: string
        name: string
    }
    
    class TagsInSong {
        tags_in_song_id: string
        song_id: string
        tag_id: string
    }
    
    class User {
        user_id: string
        username: string
        password: strings
    }

```