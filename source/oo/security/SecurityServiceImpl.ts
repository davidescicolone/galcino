import {SimpleUser} from "../../models/models";
import {UnauthorizedError} from "../../services/errors";
import jwt from "jsonwebtoken";
import {SecurityService} from "./SecurityService";
import {UserRepository} from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import {userFrom} from "../../database/converters/users";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityServiceImpl implements SecurityService{
    constructor(@inject('UserRepository') private userRepository: UserRepository) {}
    async login(username: string, password: string): Promise<SimpleUser> {

        const dbUser = await this.userRepository.getUser(username)

        if (!dbUser) {
            throw new UnauthorizedError()
        }

        if (await bcrypt.hash(password, dbUser.salt) == dbUser.encryptedPassword) {
            return userFrom(dbUser)
        }

        throw new UnauthorizedError()
    }

    verifyToken(authorizationHeader?: string): SimpleUser {
        try {
            const [bearer, token]:string[] = authorizationHeader!.split(" ")

            if(bearer != "Bearer") {
                throw new UnauthorizedError()
            }

            return <SimpleUser>jwt.verify(token, `${process.env["jwt_secret"]}`)
        } catch (e) {
            throw new UnauthorizedError()
        }
    }
}