export interface User {
    user_id: string
    username: string
    password_hash: string
    api_key: string
    is_deleted: boolean
    created: number
    modified: number
}