import {DBUser} from "../models/models";
import {SecretUser, SimpleUser} from "../../models/models";
import bcrypt from "bcrypt";

export const userFrom = (dbUser:DBUser):SimpleUser => {

    return {
        firstName: dbUser.firstName,
        id: dbUser._id!.toString(),
        lastName: dbUser.lastName,
        type: dbUser.type,
        username: dbUser.username
    }
}

export const dbUserFrom = async (user: SecretUser): Promise<DBUser> => {

    const salt = await bcrypt.genSalt(12)

    return {
        firstName: user.firstName!,
        lastName: user.lastName!,
        username: user.username,
        approved: false,
        encryptedPassword: await bcrypt.hash(user.password, salt),
        salt: salt,
        type: user.type!
    }
}
