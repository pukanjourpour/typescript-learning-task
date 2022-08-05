import { Controller } from "tsoa";
import User from "../models/User";
import Database from "sqlite-async";
import Session from "../models/Session";
import Playlist from "../models/Playlist";

export class ControllerDatabase extends Controller {

	public static async InsertUser(user: User): Promise<number> {
		let user_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = `INSERT INTO user (user_uuid, username, password_hash, is_deleted, created, modified)
                   VALUES ($user_uuid, $username, $password_hash, $is_deleted, $created, $modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(user));
				user_id = result.lastID;
				console.log(`Added user with id ${user_id}`);
			} catch (err) {
				console.log(err);
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
                   LIMIT 1`;
				user = await db.get(sql, ControllerDatabase.GenerateParamsSQL({ user_uuid: user_uuid }));
				if (user) {
					console.log(`User with uuid ${user_uuid} was found, id is ${user.user_id}`);
				} else {
					console.log(`User with uuid ${user_uuid} was not found`);
				}
			} catch (err) {
				console.log(err);
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
                   LIMIT 1`;
				user = await db.get(sql, ControllerDatabase.GenerateParamsSQL({ username: username }));
				if (user) {
					console.log(`User with username ${username} found, id is ${user.user_id}`);
				} else {
					console.log(`User with username ${username} was not found`);
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return user;
	}

	public static async GetUserByUsernameAndPassword(username: string, password_hash: string): Promise<User | null> {
		let user: User | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT *
                   FROM user
                   WHERE username = $username
                     AND password_hash = $password_hash
                   LIMIT 1`;
				user = await db.get(sql, ControllerDatabase.GenerateParamsSQL({
					username: username,
					password_hash: password_hash,
				}));
				if (user) {
					console.log(`Password for ${username} is correct`);
				} else {
					console.log(`Password for ${username} is incorrect`);
				}
			} catch (err) {
				console.log(err);
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
				let sql = `INSERT INTO session (user_id, is_active, session_hash, is_deleted, created, modified)
                   VALUES ($user_id, $is_active, $session_hash, $is_deleted, $created, $modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(session));
				session_id = result.lastID;
				session.session_id = result.lastID;
				console.log(`Added session with id ${session_id}`);
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return session_id;
	}

	public static async GetSessionByUserId(user_id: number): Promise<Session | null> {
		let session: Session | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM session WHERE user_id = $user_id LIMIT 1";
				session = await db.get(sql, ControllerDatabase.GenerateParamsSQL({ user_id: user_id }));
				if (session) {
					console.log(`Session was found for user with id ${user_id}`);
				} else {
					console.log(`Session was not found for user with id ${user_id}`);
				}
			} catch (err) {
				console.log(err);
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
                   SET user_id      = $user_id,
                       is_active    = $is_active,
                       session_hash = $session_hash,
                       is_deleted   = $is_deleted,
                       created      = $created,
                       modified     = $modified
                   WHERE session_id = $session_id`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(session));
				is_success = true;
				console.log(`Updated session with id ${session.session_id}`);
			} catch (err) {
				console.log(err);
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
				let sql = `INSERT INTO playlist (user_id, user_uuid, title, description, is_deleted, created, modified)
                   VALUES ($user_id, $user_uuid, $title, $description, $is_deleted, $created, $modified)`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL(playlist));
				playlist_id = result.lastID;
				console.log(`Added playlist with id ${playlist_id}`);
			} catch (err) {
				console.log(err);
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
				let sql = `UPDATE playlist
                   SET is_deleted = $is_deleted,
                       modified   = $modified
                   WHERE playlist_id = $playlist_id`;
				let result = await db.run(sql, ControllerDatabase.GenerateParamsSQL({
					playlist_id: playlist_id,
					is_deleted: 1,
					modified: Date.now(),
				}));
				is_success = true;
				console.log(`Soft deleted playlist with id ${playlist_id}`);
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return is_success;
	}

	public static async GetAllPlaylists(): Promise<Playlist[]> {
		let playlists: Playlist[] = [];
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT *
                   FROM playlist`;
				let rows = await db.all(sql);
				if (rows) {
					for (let row of rows) {
						playlists.push(row as Playlist);
					}
					console.log(`Fetched all playlists`);
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return playlists;
	}

	public static async GetPlaylistsByUserId(user_id: number): Promise<Playlist[]> {
		let playlists: Playlist[] = [];
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = `SELECT *
                   FROM playlist
                   WHERE user_id = $user_id`;
				let rows = await db.all(sql, ControllerDatabase.GenerateParamsSQL({ user_id: user_id }));
				if (rows) {
					for (let row of rows) {
						playlists.push(row as Playlist);
					}
					console.log(`Fetched playlists created by user with id ${user_id}`);
				}
			} catch (err) {
				console.log(err);
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
				let sql = "SELECT * FROM playlist WHERE playlist_id = $playlist_id LIMIT 1";
				playlist = await db.get(sql, ControllerDatabase.GenerateParamsSQL({ playlist_id: playlist_id }));
				if (playlist) {
					console.log(`Playlist was found for user with id ${playlist_id}`);
				} else {
					console.log(`Playlist was not found for user with id ${playlist_id}`);
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		await db.close();
		return playlist;
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