import { Controller } from "tsoa";
import { User } from "../models/User";
import Database from "sqlite-async";
import { Session } from "../models/Session";
import Playlist from "../models/Playlist";

export class ControllerDatabase extends Controller {

	public static async InsertUser(user: User): Promise<number> {
		let user_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = "INSERT INTO user (user_uuid, username, password_hash, is_deleted, created, modified) VALUES ($user_uuid, $username, $password_hash, $is_deleted, $created, $modified)";
				let result = await db.run(sql, {
					$user_uuid: user.user_uuid,
					$username: user.username,
					$password_hash: user.password_hash,
					$is_deleted: user.is_deleted,
					$created: user.created,
					$modified: user.modified,
				});
				user_id = result.lastID;
				console.log("Added user with id", user_id);
				db.close();
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return user_id;
	}

	public static async GetUserByUuid(user_uuid: string): Promise<User | null> {
		let user: User | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM user WHERE user_uuid = $user_uuid";
				user = await db.get(sql, { $user_uuid: user_uuid });
				if (user) {
					console.log("User with uuid", user_uuid, "was found, id is", user.user_id);
				} else {
					console.log("User with uuid", user_uuid, "was not found");
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return user;
	}

	public static async GetUserByUsername(username: string): Promise<User | null> {
		let user: User | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM user WHERE username = $username";
				user = await db.get(sql, { $username: username });
				if (user) {
					console.log("User with username", username, "found, id is", user.user_id);
				} else {
					console.log("User with username", username, "was not found");
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return user;
	}

	public static async GetUserByUsernameAndPassword(username: string, password_hash: string): Promise<User | null> {
		let user: User | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM user WHERE username = $username AND password_hash = $password_hash";
				user = await db.get(sql, {
					$username: username,
					$password_hash: password_hash,
				});
				if (user) {
					console.log("Password for", username, "is correct");
				} else {
					console.log("Password for", username, "is incorrect");
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return user;
	}

	public static async InsertSession(session: Session): Promise<number> {
		let session_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = "INSERT INTO session (user_id, is_active, session_hash, is_deleted, created, modified) VALUES ($user_id, $is_active, $session_hash, $is_deleted, $created, $modified)";
				let result = await db.run(sql, {
					$user_id: session.user_id,
					$is_active: session.is_active,
					$session_hash: session.session_hash,
					$is_deleted: session.is_deleted,
					$created: session.created,
					$modified: session.modified,
				});
				session_id = result.lastID;
				console.log("Added session with id", session_id);
				db.close();
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return session_id;
	}

	public static async GetSessionByUserId(user_id: number): Promise<Session | null> {
		let session: Session | null = null;
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM session WHERE user_id = $user_id";
				session = await db.get(sql, { $user_id: user_id });
				if (session) {
					console.log("Session was found for user with id", user_id);
				} else {
					console.log("Session was not found for user with id", user_id);
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return session;
	}

	public static async UpdateSession(session: Session): Promise<boolean> {
		let is_success = false;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = "UPDATE session SET user_id = $user_id, is_active = $is_active, session_hash = $session_hash, is_deleted = $is_deleted, created = $created, modified = $modified WHERE session_id = $session_id";
				let result = await db.run(sql, {
					$session_id: session.session_id,
					$user_id: session.user_id,
					$is_active: session.is_active,
					$session_hash: session.session_hash,
					$is_deleted: session.is_deleted,
					$created: session.created,
					$modified: session.modified,
				});
				is_success = true;
				console.log("Updated session with id", session.session_id);
				db.close();
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return is_success;
	}

	public static async InsertPlaylist(playlist: Playlist): Promise<number> {
		let playlist_id = -1;
		let db: Database = await ControllerDatabase.ConnectToDatabase();
		if (db) {
			try {
				let sql = "INSERT INTO playlist (user_id, user_uuid, title, description, is_deleted, created, modified) VALUES ($user_id, $user_uuid, $title, $description, $is_deleted, $created, $modified)";
				let result = await db.run(sql, {
					$user_id: playlist.user_id,
					$user_uuid: playlist.user_uuid,
					$title: playlist.title,
					$description: playlist.description,
					$is_deleted: playlist.is_deleted,
					$created: playlist.created,
					$modified: playlist.modified,
				});
				playlist_id = result.lastID;
				console.log("Added playlist with id", playlist_id);
				db.close();
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return playlist_id;
	}


	public static async GetAllPlaylists(): Promise<Playlist[]> {
		let playlists: Playlist[] = [];
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM playlist";
				let rows = await db.all(sql);
				if (rows) {
					for (let row of rows) {
						playlists.push(row as Playlist);
					}
					console.log("Fetched all playlists");
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return playlists;
	}

	public static async GetPlaylistsByUserId(user_id: number): Promise<Playlist[]> {
		let playlists: Playlist[] = [];
		let db: Database = await ControllerDatabase.ConnectToDatabase();

		if (db) {
			try {
				let sql = "SELECT * FROM playlist WHERE user_id = $user_id";
				let rows = await db.all(sql, { $user_id: user_id });
				if (rows) {
					for (let row of rows) {
						playlists.push(row as Playlist);
					}
					console.log("Fetched playlists created by user with id", user_id);
				}
			} catch (err) {
				console.log(err);
			}
		} else {
			throw new Error("Unexpected error");
		}
		return playlists;
	}

	private static async ConnectToDatabase(): Promise<Database | null> {
		let db: Database | null = null;
		try {
			console.log("Connecting to database...");
			db = await Database.open("./database/db.sqlite");
		} catch (err: any) {
			console.log("Could not connect to database.");
		}
		return db;
	}
}