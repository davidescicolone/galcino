import {User} from "../domain/User";
import {UserDTO} from "../dto/UserDTO";


export interface SecurityService {
    verifyToken (authorizationHeader: string):UserDTO
    login (username: string, password: string): Promise<User>
    createToken(user:User):string
}