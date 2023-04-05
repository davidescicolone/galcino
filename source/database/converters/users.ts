import {DBUser, PartialDBUser} from "../models/models";
import {SecretUser, SimpleUser} from "../../models/models";
import bcrypt from "bcrypt";

export const userFrom = (dbUser:DBUser):SimpleUser => {

    return {
        firstName: dbUser.firstName,
        id: dbUser._id!.toString(),
        lastName: dbUser.lastName,
        type: dbUser.type,
        username: dbUser.username,
        approved: dbUser.approved
    }
}

export const enhanceDBUser = (dbUser: DBUser, user: SimpleUser): DBUser => {
    return {
        ...dbUser,
        ...partialDBUserFrom(user)
    }
}

const partialDBUserFrom = (user: SimpleUser): PartialDBUser => {

    return {
        firstName: user.firstName!,
        lastName: user.lastName!,
        username: user.username,
        approved: user.approved,
        type: user.type!
    }
}

export const dbUserFrom = async (user: SecretUser): Promise<DBUser> => {

    const salt = await bcrypt.genSalt(12)

    return {
        ...partialDBUserFrom(user),
        encryptedPassword: await bcrypt.hash(user.password, salt),
        salt: salt
    }
}
