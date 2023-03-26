import {collections} from "../database";
import {SecretUser, SimpleUser} from "../../models/models";
import {DBUser} from "../models/models";
import {ObjectId} from "mongodb";
import {dbUserFrom, userFrom} from "../converters/users";

export const insertUser = async (user: SecretUser) => {

    const dbUser: DBUser = await dbUserFrom(user)

    await collections.users!.insertOne(dbUser)
}

export async function getUser(id: ObjectId): Promise<SimpleUser> {

    const user = await collections.users!.findOne({_id: id})

    return userFrom(user!)
}

export const getDBUserFromUsername = async (username: string): Promise<DBUser> => {

    const user = await collections.users?.findOne({username:username})

    return user!
}