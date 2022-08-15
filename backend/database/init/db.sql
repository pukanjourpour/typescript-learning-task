CREATE TABLE IF NOT EXISTS user
(
    user_id INTEGER PRIMARY KEY NOT NULL,
    user_uuid CHAR(36) NOT NULL,
    username VARCHAR(128) NOT NULL,
    password_hash CHAR(64) NOT NULL,
    user_is_deleted INTEGER DEFAULT 0 NOT NULL,
    user_created INTEGER NOT NULL,
    user_modified INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS song
(
    song_id INTEGER PRIMARY KEY NOT NULL,
    song_user_id INTEGER NOT NULL,
    song_user_uuid CHAR(36) NOT NULL,
    file_path TEXT NOT NULL,
    song_title VARCHAR(128) NOT NULL,
    artist VARCHAR(128) NOT NULL,
    album VARCHAR(128) NOT NULL,
    song_is_deleted INTEGER DEFAULT 0 NOT NULL,
    song_created INTEGER NOT NULL,
    song_modified INTEGER NOT NULL,
    FOREIGN KEY(song_user_id) REFERENCES user(user_id),
    FOREIGN KEY(song_user_uuid) REFERENCES user(user_uuid)
);
CREATE TABLE IF NOT EXISTS playlist
(
    playlist_id INTEGER PRIMARY KEY NOT NULL,
    playlist_user_id INTEGER NOT NULL,
    playlist_user_uuid CHAR(36) NOT NULL,
    playlist_title VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    playlist_is_deleted INTEGER DEFAULT 0 NOT NULL,
    playlist_created INTEGER NOT NULL,
    playlist_modified INTEGER NOT NULL,
    FOREIGN KEY(playlist_user_id) REFERENCES user(user_id),
    FOREIGN KEY(playlist_user_uuid) REFERENCES user(user_uuid)
);
CREATE TABLE IF NOT EXISTS session
(
    session_id INTEGER PRIMARY KEY NOT NULL,
    session_user_id INTEGER NOT NULL,
    is_active INTEGER NOT NULL,
    session_hash CHAR(64) NOT NULL,
    session_is_deleted INTEGER DEFAULT 0 NOT NULL,
    session_created INTEGER NOT NULL,
    session_modified INTEGER NOT NULL,
    FOREIGN KEY(session_user_id) REFERENCES user(user_id)
);
CREATE TABLE IF NOT EXISTS tag
(
    tag_id INTEGER PRIMARY KEY NOT NULL,
    tag_title VARCHAR(64) NOT NULL,
    tag_is_deleted INTEGER DEFAULT 0 NOT NULL,
    tag_created INTEGER NOT NULL,
    tag_modified INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS songs_in_playlist
(
    sip_id INTEGER PRIMARY KEY NOT NULL,
    sip_playlist_id INTEGER NOT NULL,
    sip_song_id INTEGER NOT NULL,
    sip_is_deleted INTEGER DEFAULT 0 NOT NULL,
    sip_created INTEGER NOT NULL,
    sip_modified INTEGER NOT NULL,
    FOREIGN KEY(sip_playlist_id) REFERENCES user(playlist_id),
    FOREIGN KEY(sip_song_id) REFERENCES song(song_id)
);
CREATE TABLE IF NOT EXISTS tags_in_song
(
    tis_id INTEGER PRIMARY KEY NOT NULL,
    tis_song_id INTEGER NOT NULL,
    tis_tag_id INTEGER NOT NULL,
    tis_is_deleted INTEGER DEFAULT 0 NOT NULL,
    tis_created INTEGER NOT NULL,
    tis_modified INTEGER NOT NULL,
    FOREIGN KEY(tis_song_id) REFERENCES song(song_id),
    FOREIGN KEY(tis_tag_id) REFERENCES tag(tag_id)
);