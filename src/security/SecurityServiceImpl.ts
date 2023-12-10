import {UnauthorizedError} from "../errors/errors";
import jwt from "jsonwebtoken";
import {SecurityService} from "./SecurityService";
import {UserRepository} from "../repositories/UserRepository";
import {inject, injectable} from "inversify";
import {User} from "../domain/User";
import {UserDTO} from "../dto/UserDTO";
import {DTOConverter} from "../converters/DTOConverter";

@injectable()
export class SecurityServiceImpl implements SecurityService{
    constructor(
        @inject('UserRepository') private userRepository: UserRepository,
        @inject('DTOConverter') private dtoConverter: DTOConverter
    ) {}

    createToken(user: User): string {
        return jwt.sign(this.dtoConverter.userDTOFrom(user),`${process.env["jwt_secret"]}`)
    }
    async login(username: string, password: string): Promise<User> {

        const user = await this.userRepository.getUserFromCredentials(username,password)

        if(user) {
            return user
        }

        throw new UnauthorizedError()
    }

    verifyToken(authorizationHeader?: string): UserDTO {
        try {
            const [bearer, token]:string[] = authorizationHeader!.split(" ")

            if(bearer != "Bearer") {
                throw new UnauthorizedError()
            }

            return <UserDTO>jwt.verify(token, `${process.env["jwt_secret"]}`)

        } catch (e) {
            throw new UnauthorizedError()
        }
    }
}