import {DBUser} from "../../database/models/models";

export interface UserRepository {
    getUser(username:string):Promise<DBUser>;
}