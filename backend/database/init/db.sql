CREATE TABLE IF NOT EXISTS user
(
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER
);
CREATE TABLE IF NOT EXISTS song
(
    song_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_path TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER
);
CREATE TABLE IF NOT EXISTS playlist
(
    playlist_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER
);
CREATE TABLE IF NOT EXISTS session
(
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    is_active INTEGER NOT NULL,
    session_hash TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER
);
CREATE TABLE IF NOT EXISTS tag
(
    tag_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER
);
CREATE TABLE IF NOT EXISTS songs_in_playlist
(
    songs_in_playlist_id TEXT PRIMARY KEY,
    playlist_id TEXT NOT NULL,
    song_id TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER
);
CREATE TABLE IF NOT EXISTS tags_in_song
(
    tags_in_song_id TEXT PRIMARY KEY,
    song_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER
);