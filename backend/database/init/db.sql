CREATE TABLE IF NOT EXISTS user
(
    user_id INTEGER PRIMARY KEY NOT NULL,
    user_uuid CHAR(36) NOT NULL,
    username VARCHAR(128) NOT NULL,
    password_hash CHAR(64) NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS song
(
    song_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    user_uuid CHAR(36) NOT NULL,
    file_path TEXT NOT NULL,
    title VARCHAR(128) NOT NULL,
    artist VARCHAR(128) NOT NULL,
    album VARCHAR(128) NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(user_uuid) REFERENCES user(user_uuid)
);
CREATE TABLE IF NOT EXISTS playlist
(
    playlist_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    user_uuid CHAR(36) NOT NULL,
    title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(user_uuid) REFERENCES user(user_uuid)
);
CREATE TABLE IF NOT EXISTS session
(
    session_id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    is_active INTEGER NOT NULL,
    session_hash CHAR(64) NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES user(user_id)
);
CREATE TABLE IF NOT EXISTS tag
(
    tag_id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(64) NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS songs_in_playlist
(
    songs_in_playlist_id INTEGER PRIMARY KEY NOT NULL,
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER NOT NULL,
    FOREIGN KEY(playlist_id) REFERENCES user(playlist_id),
    FOREIGN KEY(song_id) REFERENCES song(song_id)
);
CREATE TABLE IF NOT EXISTS tags_in_song
(
    tags_in_song_id INTEGER PRIMARY KEY NOT NULL,
    song_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    is_deleted INTEGER DEFAULT 0 NOT NULL,
    created INTEGER NOT NULL,
    modified INTEGER NOT NULL,
    FOREIGN KEY(song_id) REFERENCES song(song_id),
    FOREIGN KEY(tag_id) REFERENCES tag(tag_id)
);