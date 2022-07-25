import {Controller} from "tsoa";
import {User} from "../models/User";
import {Session} from "../models/Session";
import Playlist from "../models/Playlist";

export class ControllerDatabase extends Controller {

    public static async InsertUser(user: User): Promise<void> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `INSERT INTO user (user_id, username, password_hash, is_deleted, created, modified)
                           VALUES ('${user.user_id}', '${user.username}', '${user.password_hash}', ${user.is_deleted},
                                   ${user.created}, ${user.modified})`;
                db.exec(
                    sql,
                    function (err) {
                        if (err) {
                            console.log(err)
                            reject(new Error("Unexpected error"))
                        } else {
                            console.log(`Added user with id ${user.user_id}`)
                            resolve();
                        }
                    }
                );

                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async GetUserByUsername(username: string): Promise<User|null> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `SELECT *
                           FROM user
                           WHERE username = ?`
                db.get(
                    sql,
                    [username],
                    function (err, row) {
                        if (err) {
                            reject(err)
                        } else {
                            if (row) {
                                let user = {
                                    user_id: row.user_id,
                                    username: username,
                                    password_hash: row.password_hash,
                                    is_deleted: row.is_deleted,
                                    created: row.created,
                                    modified: row.modified
                                } as User
                                console.log(`User with username '${username}' found, id is ${user.user_id}`)
                                resolve(user)
                            } else {
                                console.log(`No user found with the username '${username}'`)
                                resolve(null)
                            }
                        }
                    }
                );
                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async GetUserByUsernameAndPassword(username: string, password_hash: string): Promise<User|null> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `SELECT *
                           FROM user
                           WHERE username = ?
                             and password_hash = ?`;
                db.get(
                    sql,
                    [username, password_hash],
                    function (err, row) {
                        if (err) {
                            reject(err)
                        } else {
                            if (row) {
                                let user = {
                                    user_id: row.user_id,
                                    username: username,
                                    password_hash: password_hash,
                                    is_deleted: row.is_deleted,
                                    created: row.created,
                                    modified: row.modified
                                } as User
                                console.log(`Password for user '${username}' is correct`)
                                resolve(user)
                            } else {
                                console.log(`Password for user '${username}' is incorrect`)
                                resolve(null)
                            }
                        }
                    }
                );
                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async InsertSession(session: Session): Promise<void> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `INSERT INTO session (session_id, user_id, is_active, session_hash, is_deleted, created,
                                                modified)
                           VALUES ('${session.session_id}', '${session.user_id}', '${session.is_active}',
                                   '${session.session_hash}', ${session.is_deleted}, ${session.created},
                                   ${session.modified})`;
                db.exec(
                    sql,
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(`Added session with id ${session.session_id}`)
                            resolve();
                        }
                    }
                );
                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async GetSessionByUserId(user_id: string): Promise<Session|null> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `SELECT *
                           FROM session
                           WHERE user_id = ?`
                db.get(
                    sql,
                    [user_id],
                    function (err, row) {
                        if (err) {
                            reject(err)
                        } else {
                            if (row) {
                                let session = {
                                    session_id: row.session_id,
                                    user_id: user_id,
                                    is_active: row.is_active,
                                    session_hash: row.session_hash,
                                    is_deleted: row.is_deleted,
                                    created: row.created,
                                    modified: row.modified
                                } as Session
                                console.log(`Session for user with id '${user_id}' found, id is ${session.session_id}`)
                                resolve(session)
                            } else {
                                console.log(`No session found for user with id '${user_id}'`)
                                resolve(null)
                            }
                        }
                    }
                );
                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async UpdateSession(session: Session): Promise<void> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `UPDATE session SET session_hash = ?, modified = ? WHERE session_id = ?`
                db.run(
                    sql,
                    [session.session_hash, session.modified, session.session_id],
                    function (err) {
                        if (err) {
                            console.log(err)
                            reject(err);
                        } else {
                            console.log(`Updated session with id ${session.session_id}`)
                            resolve();
                        }
                    }
                );
                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async InsertPlaylist(playlist: Playlist): Promise<void> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `INSERT INTO playlist (playlist_id, user_id, title, description, is_deleted, created, modified)
                           VALUES ('${playlist.playlist_id}', '${playlist.user_id}', '${playlist.title}', '${playlist.description}', ${playlist.is_deleted},
                                   ${playlist.created}, ${playlist.modified})`;
                db.exec(
                    sql,
                    function (err) {
                        if (err) {
                            console.log(err)
                            reject(new Error("Unexpected error"))
                        } else {
                            console.log(`Added playlist with id ${playlist.user_id}`)
                            resolve();
                        }
                    }
                );

                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async GetAllPlaylists(): Promise<Playlist[]> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `SELECT * FROM playlist`

                db.all(sql,
                    (err, rows) => {
                    if (err){
                        reject(err)
                    } else {
                        let playlists: Playlist[] = [];
                        rows.forEach((row) => {
                            playlists.push({
                                playlist_id: row.playlist_id,
                                user_id: row.user_id,
                                title: row.title,
                                description: row.description,
                                is_deleted: row.is_deleted,
                                created: row.created,
                                modified: row.modified
                            } as Playlist);
                        });
                        console.log("User fetched all playlists")
                        resolve(playlists)
                    }
                });
                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    public static async GetPlaylistsByUserId(user_id: string): Promise<Playlist[]> {
        let db = ControllerDatabase.ConnectToDatabase();
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `SELECT * FROM playlist WHERE user_id = ?`

                db.all(sql,
                    [user_id],
                    (err, rows) => {
                        if (err){
                            reject(err)
                        } else {
                            let playlists: Playlist[] = [];
                            rows.forEach((row) => {
                                playlists.push({
                                    playlist_id: row.playlist_id,
                                    user_id: row.user_id,
                                    title: row.title,
                                    description: row.description,
                                    is_deleted: row.is_deleted,
                                    created: row.created,
                                    modified: row.modified
                                } as Playlist);
                            });
                            console.log(`Fetched all playlists created by user '${user_id}'`)
                            resolve(playlists)
                        }
                    });
                db.close()
            } else {
                reject(new Error("Unexpected error"))
            }
        });
    }

    private static ConnectToDatabase() {
        let db;
        try {
            console.log("Connecting to database...")
            let sqlite3 = require('sqlite3').verbose();
            db = new sqlite3.Database('./database/db.sqlite');
        } catch (err: any) {
            console.log('Could not connect to database.')
        }
        return db;
    }
}