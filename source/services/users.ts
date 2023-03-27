import {getDBUserFromUsername} from "../database/queries/users";
import {SimpleUser} from "../models/models";
import {ObjectId} from "mongodb";

export const getUserIdFromUser = async (user?: SimpleUser):Promise<ObjectId|undefined> => {

    if(user === undefined) {
        return undefined
    }

    return user.id ? new ObjectId(user.id) : (await getDBUserFromUsername(user.username))._id

}