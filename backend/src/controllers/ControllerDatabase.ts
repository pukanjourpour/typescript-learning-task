import {Controller} from "tsoa";
import {User} from "../models/User";
import {Session} from "../models/Session";

export class ControllerDatabase extends Controller {

    public static async InsertUser(user: User): Promise<{ user: User | null, status: number }> {
        let db;
        try {
            console.log("Connecting to database...")
            let sqlite3 = require('sqlite3').verbose();
            db = new sqlite3.Database('./database/db.sqlite');
        } catch (err: any) {
            console.log('Could not connect to database.')
        }
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `INSERT INTO user (user_id, username, password_hash, is_deleted, created, modified)
                           VALUES ('${user.user_id}', '${user.username}', '${user.password_hash}', ${user.is_deleted},
                                   ${user.created}, ${user.modified})`;
                db.exec(
                    sql,
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(`Added user with id ${user.user_id}`)
                            resolve({user: user, status: 0});
                        }
                    }
                );

                db.close()
            } else {
                resolve({user: null, status: -1})
            }
        });
    }

    public static async GetUserByUsername(username: string): Promise<{ user: User | null, status: number }> {
        let db;
        try {
            console.log("Connecting to database...")
            let sqlite3 = require('sqlite3').verbose();
            db = new sqlite3.Database('./database/db.sqlite');
        } catch (err: any) {
            console.log('Could not connect to database.')
        }
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
                                resolve({user: user, status: 0})
                            } else {
                                console.log(`No user found with the username '${username}'`)
                                resolve({user: null, status: 3})
                            }
                        }
                    }
                );
                db.close()
            } else {
                resolve({user: null, status: -1})
            }
        });
    }

    public static async GetUserByUsernameAndPassword(username: string, password_hash: string): Promise<{ user: User | null, status: number }> {
        let db;
        try {
            console.log("Connecting to database...")
            let sqlite3 = require('sqlite3').verbose();
            db = new sqlite3.Database('./database/db.sqlite');
        } catch (err: any) {
            console.log('Could not connect to database.')
        }
        return new Promise((resolve, reject) => {
            if (db) {
                let sql = `SELECT *
                           FROM user
                           WHERE username = ?
                             and password_hash = ?`
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
                                resolve({user: user, status: 0})
                                console.log(`Password for user '${username}' is correct`)
                            } else {
                                console.log(`No user found with the username '${username}' and password '${password_hash}'`)
                                resolve({user: null, status: 4})
                            }
                        }
                    }
                );
                db.close()
            } else {
                resolve({user: null, status: -1})
            }
        });
    }

    public static async InsertSession(session: Session): Promise<{ session: Session | null, status: number }> {
        let db;
        try {
            console.log("Connecting to database...")
            let sqlite3 = require('sqlite3').verbose();
            db = new sqlite3.Database('./database/db.sqlite');
        } catch (err: any) {
            console.log('Could not connect to database.')
        }
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
                            resolve({session: session, status: 0});
                        }
                    }
                );
                db.close()
            } else {
                resolve({session: null, status: -1})
            }
        });
    }
}