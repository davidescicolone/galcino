import {DTOConverter} from "./DTOConverter";
import {UserDTO} from "../dto/UserDTO";
import {SecretUserDTO} from "../dto/SecretUserDTO";
import {MatchDTO} from "../dto/MatchDTO";
import {Match} from "../domain/Match";
import {Team} from "../domain/Team";
import {TeamDTO} from "../dto/TeamDTO";
import {inject, injectable} from "inversify";
import {PlayerDTO} from "../dto/PlayerDTO";
import {UserRepository} from "../repositories/UserRepository";
import {SecretUser, User} from "../domain/User";
import {Player} from "../domain/Player";

@injectable()
export class DTOConverterImpl implements  DTOConverter {

    constructor(
        @inject('UserRepository') private userRepository: UserRepository
    ) {}

    userDTOFrom(user: User): UserDTO {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            type: user.type,
            id: user.id,
        }
    }
    matchDTOFrom(match: Match): MatchDTO {
        return {
            teams: match.teams.map(team => this.teamDTOFrom(team)),
            approved: match.approved,
            timestamp: match.timestamp,
            superApprovedBy: match.superApprovedBy,
            superApproved: match.superApproved,
            id: match.id
        }
    }

    teamDTOFrom(team: Team):TeamDTO {
        return team
    }

    secretUserFrom(secretUserDTO: SecretUserDTO): SecretUser {
        return new SecretUser(
            secretUserDTO.firstName,
            secretUserDTO.lastName,
            secretUserDTO.username,
            secretUserDTO.type,
            secretUserDTO.password,
            secretUserDTO.id
        )
    }

    userFrom(userDTO?: UserDTO): User|undefined {

        if(!userDTO) {
            return undefined
        }

        return new User(
            userDTO.firstName,
            userDTO.lastName,
            userDTO.username,
            userDTO.type,
            userDTO.id
        )
    }

    async playerFrom(playerDTO: PlayerDTO): Promise<Player> {

        const user = await this.userRepository.getUserFromUsername(playerDTO.username)

        return new Player(user!, false)
    }

    async matchFrom(matchDTO: MatchDTO): Promise<Match> {
        return new Match(
            await Promise.all(matchDTO.teams.map(teamDTO => this.teamFrom(teamDTO))),
            false,
            matchDTO.timestamp,
            matchDTO.id,
            this.userFrom(matchDTO.superApprovedBy),
            matchDTO.superApproved
        )
    }

    private async teamFrom(teamDTO: TeamDTO): Promise<Team> {
        return {
            players: await Promise.all(teamDTO.players.map(playerDTO => {
                return this.playerFrom(playerDTO)
            })),
            score: teamDTO.score
        }
    }
}