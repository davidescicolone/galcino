import {UserRepository} from "./UserRepository";
import {DBUser} from "../../database/models/models";
import {collections} from "../../database/database";
import {injectable} from "inversify";

@injectable()
export class UserRepositoryImpl implements UserRepository {
    async getUser(username: string): Promise<DBUser> {
        const user = await collections.users?.findOne({username: username})
        return user!
    }
}