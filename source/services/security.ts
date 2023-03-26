import jwt, {JwtPayload} from "jsonwebtoken";
import {UnauthorizedError} from "./errors";
import {SimpleUser} from "../models/models";
import bcrypt from "bcrypt";
import {DBUser} from "../database/models/models";
import {getDBUserFromUsername} from "../database/queries/users";
import {userFrom} from "../database/converters/users";

export const verifyToken = (authorizationHeader: string):SimpleUser =>  {
    try {
        const [bearer, token]:string[] = authorizationHeader.split(" ")

        if(bearer != "Bearer") {
            throw new UnauthorizedError()
        }

        return <SimpleUser>jwt.verify(token, `${process.env["jwt_secret"]}`)
    } catch (e) {
        throw new UnauthorizedError()
    }
}

export const login = async (username: string, password: string): Promise<SimpleUser> => {

    const dbUser = await getDBUserFromUsername(password)

    if(!dbUser) {
        throw new UnauthorizedError()
    }

    if(await bcrypt.hash(password, dbUser.salt) == dbUser.encryptedPassword) {
        return userFrom(dbUser)
    }

    throw new UnauthorizedError()
}

export const createToken = (jwtPayload:any):string => {
    return jwt.sign(jwtPayload,`${process.env["jwt_secret"]}`)
}