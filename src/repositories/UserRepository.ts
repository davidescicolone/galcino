import {SecretUser, User} from "../domain/User";

export interface UserRepository {
    getUserFromId(id?:string):Promise<User|undefined>
    getUserFromUsername(username?:string):Promise<User|undefined>
    insertUser(user:SecretUser):void
    getUserFromCredentials(username:string, password:string):Promise<User|undefined>
    search(query:string):Promise<User[]>
}