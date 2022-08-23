import User from "../models/User";
import Database from "sqlite-async";
import Session from "../models/Session";
import Playlist from "../models/Playlist";
import Song from "../models/Song";
import SongsInPlaylist from "../models/SongsInPlaylist";
import { getLogger } from "log4js";

const logger = getLogger("ControllerDatabase");
logger.level = "info";

export class ControllerDatabase {
	public static async InsertUser(user: User): Promise<number> {
		let user_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = `INSERT INTO user (user_uuid, username, password_hash, user_is_deleted, user_created, user_modified)
                   VALUES ($user_uuid, $username, $password_hash, $user_is_deleted, $user_created, $user_modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(user));
				user_id = result.lastID;
				logger.info(`Added user with id ${user_id}`);
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return user_id;
	}

	public static async GetUserByUuid(user_uuid: string): Promise<User | null> {
		let user: User | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT *
                   FROM user
                   WHERE user_uuid = $user_uuid
                     AND user_is_deleted != 1
                   LIMIT 1`;
				user = await db.get(sql, ControllerDatabase.GenerateParamsSQL({ user_uuid: user_uuid }));
				if (user) {
					logger.info(`User with uuid ${user_uuid} was found, id is ${user.user_id}`);
				} else {
					logger.info(`User with uuid ${user_uuid} was not found`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return user;
	}

	public static async GetUserByUsername(username: string): Promise<User | null> {
		let user: User | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT *
                   FROM user
                   WHERE username = $username
                     AND user_is_deleted != 1
                   LIMIT 1`;
				user = await db.get(sql, ControllerDatabase.GenerateParamsSQL({ username: username }));
				if (user) {
					logger.info(`User with username ${username} found, id is ${user.user_id}`);
				} else {
					logger.info(`User with username ${username} was not found`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return user;
	}

	public static async GetUserByUsernameAndPassword(
		username: string,
		password_hash: string,
	): Promise<User | null> {
		let user: User | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT *
                   FROM user
                   WHERE username = $username
                     AND password_hash = $password_hash
                   LIMIT 1`;
				user = await db.get(
					sql,
					ControllerDatabase.GenerateParamsSQL({
						username: username,
						password_hash: password_hash,
					}),
				);
				if (user) {
					logger.info(`Password for ${username} is correct`);
				} else {
					logger.info(`Password for ${username} is incorrect`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return user;
	}

	public static async InsertSession(session: Session): Promise<number> {
		let session_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = `INSERT INTO session (session_user_id, is_active, session_hash, session_is_deleted, session_created,
                                        session_modified)
                   VALUES ($session_user_id, $is_active, $session_hash, $session_is_deleted, $session_created,
                           $session_modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(session));
				session_id = result.lastID;
				session.session_id = result.lastID;
				logger.info(`Added session with id ${session_id}`);
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return session_id;
	}

	public static async GetSessionByUserId(session_user_id: number): Promise<Session | null> {
		let session: Session | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql =
					"SELECT * FROM session WHERE session_user_id = $session_user_id AND session_is_deleted != 1 LIMIT 1 ";
				session = await db.get(
					sql,
					ControllerDatabase.GenerateParamsSQL({ session_user_id: session_user_id }),
				);
				if (session) {
					logger.info(`Session was found for user with id ${session_user_id}`);
				} else {
					logger.info(`Session was not found for user with id ${session_user_id}`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return session;
	}

	public static async UpdateSession(session: Session): Promise<boolean> {
		let is_success = false;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = `UPDATE session
                   SET session_user_id    = $session_user_id,
                       is_active          = $is_active,
                       session_hash       = $session_hash,
                       session_is_deleted = $session_is_deleted,
                       session_created    = $session_created,
                       session_modified   = $session_modified
                   WHERE session_id = $session_id`;
				await db.run(sql, ControllerDatabase.GenerateParamsSQL(session));
				is_success = true;
				logger.info(`Updated session with id ${session.session_id}`);
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return is_success;
	}

	public static async InsertPlaylist(playlist: Playlist): Promise<number> {
		let playlist_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = `INSERT INTO playlist (playlist_user_id, playlist_user_uuid, playlist_title, description,
                                         playlist_is_deleted, playlist_created, playlist_modified)
                   VALUES ($playlist_user_id, $playlist_user_uuid, $playlist_title, $description, $playlist_is_deleted,
                           $playlist_created, $playlist_modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(playlist));
				playlist_id = result.lastID;
				logger.info(`Added playlist with id ${playlist_id}`);
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return playlist_id;
	}

	public static async DeletePlaylist(playlist_id: number): Promise<boolean> {
		let is_success = false;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let playlist_sql = `UPDATE playlist
                            SET playlist_is_deleted = $playlist_is_deleted,
                                playlist_modified   = $playlist_modified
                            WHERE playlist_id = $playlist_id`;
				await db.run(
					playlist_sql,
					ControllerDatabase.GenerateParamsSQL({
						playlist_id: playlist_id,
						playlist_is_deleted: 1,
						playlist_modified: Date.now(),
					}),
				);
				logger.info(`Soft deleted playlist with id ${playlist_id}`);
				let sip_sql = `UPDATE songs_in_playlist
                       SET sip_is_deleted = $sip_is_deleted,
                           sip_modified   = $sip_modified
                       WHERE sip_playlist_id = $sip_playlist_id`;
				await db.run(
					sip_sql,
					ControllerDatabase.GenerateParamsSQL({
						sip_playlist_id: playlist_id,
						sip_is_deleted: 1,
						sip_modified: Date.now(),
					}),
				);
				logger.info(`Removed songs from playlist with id ${playlist_id}`);
				is_success = true;
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return is_success;
	}

	public static async GetAllPlaylists(): Promise<Playlist[] | null> {
		let playlists: Playlist[] = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT song_id,
                          song_user_uuid,
                          song_title,
                          artist,
                          album,
                          song_created,
                          song_modified,
                          playlist_id,
                          playlist_user_uuid,
                          playlist_title,
                          description,
                          playlist_created,
                          playlist_modified
                   FROM playlist p
                            LEFT JOIN songs_in_playlist sip on sip.sip_playlist_id = p.playlist_id
                            INNER JOIN song s on s.song_id = sip.sip_song_id
                   WHERE p.playlist_is_deleted != 1
                     AND sip.sip_is_deleted != 1
                   ORDER BY p.playlist_id`;
				let rows = await db.all(sql);
				if (rows) {
					playlists = [];
					ControllerDatabase.ConstructPlaylistModels(rows, playlists);
					logger.info(`Fetched all playlists`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return playlists;
	}

	public static async GetPlaylistsByUserId(playlist_user_id: number): Promise<Playlist[] | null> {
		let playlists: Playlist[] = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT song_id,
                          song_user_uuid,
                          song_title,
                          artist,
                          album,
                          song_created,
                          song_modified,
                          playlist_id,
                          playlist_user_uuid,
                          playlist_title,
                          description,
                          playlist_created,
                          playlist_modified
                   FROM playlist p
                            LEFT JOIN songs_in_playlist sip on sip.sip_playlist_id = p.playlist_id
                            INNER JOIN song s on s.song_id = sip.sip_song_id
                   WHERE p.playlist_is_deleted != 1
                     AND sip.sip_is_deleted != 1
                     AND p.playlist_user_id = $playlist_user_id
                   ORDER BY p.playlist_id
				`;
				let rows = await db.all(
					sql,
					ControllerDatabase.GenerateParamsSQL({ playlist_user_id: playlist_user_id }),
				);
				if (rows) {
					playlists = [];
					ControllerDatabase.ConstructPlaylistModels(rows, playlists);
					logger.info(`Fetched playlists created by user with id ${playlist_user_id}`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return playlists;
	}

	public static async GetPlaylistById(playlist_id): Promise<Playlist | null> {
		let playlist: Playlist = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql =
					"SELECT * FROM playlist WHERE playlist_id = $playlist_id AND playlist_is_deleted != 1 LIMIT 1";
				playlist = await db.get(
					sql,
					ControllerDatabase.GenerateParamsSQL({ playlist_id: playlist_id }),
				);
				if (playlist) {
					logger.info(`Playlist with id ${playlist_id} was found `);
				} else {
					logger.info(`Playlist with id ${playlist_id} was not found`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return playlist;
	}

	public static async InsertSong(song: Song): Promise<number> {
		let song_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = `INSERT INTO song (song_user_id, song_user_uuid, file_path, song_title, artist, album,
                                     song_is_deleted, song_created, song_modified)
                   VALUES ($song_user_id, $song_user_uuid, $file_path, $song_title, $artist, $album, $song_is_deleted,
                           $song_created,
                           $song_modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(song));
				song_id = result.lastID;
				song.song_id = result.lastID;
				logger.info(`Added song with id ${song_id}`);
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return song_id;
	}

	public static async DeleteSong(song_id: number): Promise<boolean> {
		let is_success = false;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let song_sql = `UPDATE song
                        SET song_is_deleted = $song_is_deleted,
                            song_modified   = $song_modified
                        WHERE song_id = $song_id
                          AND song_is_deleted != 1`;
				await db.run(
					song_sql,
					ControllerDatabase.GenerateParamsSQL({
						song_id: song_id,
						song_is_deleted: 1,
						song_modified: Date.now(),
					}),
				);
				logger.info(`Soft deleted song with id ${song_id}`);
				let sip_sql = `UPDATE songs_in_playlist
                       SET sip_is_deleted = $sip_is_deleted,
                           sip_modified   = $sip_modified
                       WHERE sip_song_id = $sip_song_id
                         AND sip_is_deleted != 1`;
				await db.run(
					sip_sql,
					ControllerDatabase.GenerateParamsSQL({
						sip_song_id: song_id,
						sip_is_deleted: 1,
						sip_modified: Date.now(),
					}),
				);
				logger.info(`Removed song with id ${song_id} from playlist`);
				is_success = true;
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return is_success;
	}

	public static async GetSongById(song_id: number): Promise<Song | null> {
		let song = null;

		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM song WHERE song_id = $song_id AND song_is_deleted != 1 LIMIT 1";
				song = await db.get(sql, ControllerDatabase.GenerateParamsSQL({ song_id: song_id }));
				if (song) {
					logger.info(`Song with id ${song_id} was found`);
				} else {
					logger.info(`Playlist with id ${song_id} was not found`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();

		return song;
	}

	public static async AddSongToPlaylist(sip: SongsInPlaylist): Promise<boolean> {
		let is_success = false;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = `INSERT INTO songs_in_playlist (sip_playlist_id, sip_song_id, sip_is_deleted, sip_created,
                                                  sip_modified)
                   VALUES ($sip_playlist_id, $sip_song_id, $sip_is_deleted, $sip_created, $sip_modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(sip));
				is_success = true;
				sip.sip_id = result.lastID;
				logger.info(
					`Added song with id ${sip.sip_song_id} to playlist with id ${sip.sip_playlist_id}`,
				);
			} catch (err) {
				logger.error(err.msg);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return is_success;
	}

	public static async GetSongsByPlaylistId(sip_playlist_id: number): Promise<Song[] | null> {
		let songs: Song[] = null;

		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT *
                   FROM songs_in_playlist
                   WHERE sip_playlist_id = $sip_playlist_id
                     AND sip_is_deleted != 1`;
				let rows = await db.all(
					sql,
					ControllerDatabase.GenerateParamsSQL({ sip_playlist_id: sip_playlist_id }),
				);
				if (rows) {
					songs = [];
					for (let row of rows) {
						let song_sql = `SELECT song_id, song_user_uuid, song_title, artist, album
                            FROM song
                            WHERE song_id = $song_id
                              AND song_is_deleted != 1
                            LIMIT 1`;
						let song: Song = await db.get(
							song_sql,
							ControllerDatabase.GenerateParamsSQL({ song_id: row.sip_song_id }),
						);
						if (song) {
							songs.push(song);
						}
					}
					logger.info(`Fetched songs from playlist with id ${sip_playlist_id}`);
				}
			} catch (err) {
				logger.error(err.message);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();

		return songs;
	}

	private static ConstructPlaylistModels(rows, playlists: Playlist[]) {
		for (let row of rows) {
			let playlist_found: Playlist = null;
			for (let playlist of playlists) {
				if (playlist.playlist_id === row.playlist_id) {
					playlist_found = playlist;
					break;
				}
			}
			let song = {
				song_id: row.song_id,
				song_user_uuid: row.song_user_uuid,
				song_title: row.song_title,
				artist: row.artist,
				album: row.album,
				song_created: row.song_created,
				song_modified: row.song_modified,
			} as Song;
			if (playlist_found) {
				playlist_found.songs.push(song);
			} else {
				let playlist_found = {
					playlist_id: row.playlist_id,
					playlist_user_uuid: row.playlist_user_uuid,
					playlist_title: row.playlist_title,
					description: row.description,
					songs: [song],
					playlist_created: row.playlist_created,
					playlist_modified: row.playlist_modified,
				} as Playlist;
				playlists.push(playlist_found);
			}
		}
	}

	private static GenerateParamsSQL(values: object) {
		let length = Object.keys(values).length;
		let obj = {};
		for (let i = 0; i < length; i++) {
			let key = Object.keys(values)[i];
			obj["$" + key] = values[key];
		}
		return obj;
	}

	private static async ConnectToDatabase(): Promise<Database | null> {
		let db: Database | null = null;
		try {
			db = await Database.open("./database/db.sqlite");
		} catch (err: any) {
			console.log("Could not connect to database.");
		}
		return db;
	}
}
