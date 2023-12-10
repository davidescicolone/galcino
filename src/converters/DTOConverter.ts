import {SecretUser, User} from "../domain/User";
import {UserDTO} from "../dto/UserDTO";
import {SecretUserDTO} from "../dto/SecretUserDTO";
import {MatchDTO} from "../dto/MatchDTO";
import {Match} from "../domain/Match";

export interface DTOConverter {
    secretUserFrom(secretUserDTO:SecretUserDTO):SecretUser
    userFrom(userDTO?:UserDTO):User|undefined
    userDTOFrom(user:User):UserDTO
    matchFrom(matchDTO: MatchDTO):Promise<Match>
    matchDTOFrom(match: Match):MatchDTO
}