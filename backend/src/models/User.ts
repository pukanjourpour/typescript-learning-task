export interface User {
    user_id: string
    username: string
    password_hash: string
    is_deleted: boolean
    created: number
    modified: number
}