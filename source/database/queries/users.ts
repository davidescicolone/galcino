import {collections} from "../database";
import {SecretUser, SimpleUser} from "../../models/models";
import {DBUser} from "../models/models";
import {Document, ObjectId} from "mongodb";
import {dbUserFrom, enhanceDBUser} from "../converters/users";

export const insertUser = async (user: SecretUser) => {

    const dbUser: DBUser = await dbUserFrom(user)

    await collections.users!.insertOne(dbUser)
}

const dbUserToUserPipeline = [{
    $project:{
        firstName:1,
        id:"$_id",
        _id:0,
        lastName:1,
        type:1,
        username:1,
        approved:1
    }
}]

export async function getUser(id: ObjectId): Promise<SimpleUser> {

    const matchStage:Document[] = [{
        $match:{_id: id}
    }]

    const users = await collections.users!.aggregate(matchStage.concat(dbUserToUserPipeline)).toArray() as SimpleUser[]

    return users[0]!
}

export const getDBUserFromUsername = async (username: string): Promise<DBUser> => {

    const user = await collections.users?.findOne({username:username})

    return user!
}

const searchStage = (query:string, path:string):Document[] => {

    return [{
        $search: {
            index: "default",
            autocomplete: {
                query: query,
                path: path
            }
        }
    }]
}

export const updateUser = async (user: SimpleUser) => {

    const dbUser = await getDBUserFromUsername(user.username)

    collections.users!.replaceOne({_id: new ObjectId(dbUser._id)}, enhanceDBUser(dbUser,user))

}

export const searchUsers = async (query: string): Promise<SimpleUser[]> => {

    const queryByLastName = collections.users?.aggregate(searchStage(query,"lastName").concat(dbUserToUserPipeline)).toArray()

    const queryByFirstName = collections.users?.aggregate(searchStage(query,"firstName").concat(dbUserToUserPipeline)).toArray()

    const queryByUsername = collections.users?.aggregate(searchStage(query,"username").concat(dbUserToUserPipeline)).toArray()

    return concatAndDedup(await queryByLastName as SimpleUser[], await queryByFirstName as SimpleUser[], await queryByUsername as SimpleUser[])

}

export const concatAndDedup = (...userArrays:SimpleUser[][]):SimpleUser[] => {

    const users = userArrays.flat()

    function exists(user:SimpleUser, array: SimpleUser[]):boolean {
        for(let i=0;i<array.length;i++) {
            if(user.id!.toString() == array[i].id!.toString()) {
                return true
            }
        }

        return false

    }

    const dedupUsers:SimpleUser[] = []

    users.forEach(user => {

        if(!exists(user,dedupUsers)) {
            dedupUsers.push(user)
        }
    })

    return dedupUsers
}