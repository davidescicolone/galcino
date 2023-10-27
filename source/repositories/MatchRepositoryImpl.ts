import {MatchRepository} from "./MatchRepository";
import {collections} from "../database/database";
import {Match} from "../domain/Match";
import {Document, ObjectId} from "mongodb";
import {inject, injectable} from "inversify";
import {UserRepository} from "./UserRepository";
import {MatchDAO} from "../dao/MatchDAO";
import {TeamDAO} from "../dao/TeamDAO";
import {Team} from "../domain/Team";
import {Player} from "../domain/Player";

@injectable()
export class MatchRepositoryImpl implements MatchRepository {
    constructor(
        @inject('UserRepository') private userRepository: UserRepository
    ) {}
    async getMatch(matchId: string): Promise<Match> {
        return (await this.retrieveMatches({_id: new ObjectId(matchId)}))[0]
    }
    async insertMatch(match: Match) {
        return collections.matches!.insertOne(await this.dbMatchFrom(match))
    }

    async updateMatch(match: Match) {
        const dbMatch = await this.dbMatchFrom(match)
        collections.matches!.replaceOne({_id: dbMatch._id}, dbMatch)
    }

    private async retrieveMatches(filter: Document): Promise<Match[]> {
        const dbMatches = (await collections.matches!.find(filter).toArray()) as MatchDAO[];
        return await Promise.all(dbMatches.map(dbMatch => this.matchFrom(dbMatch)));
    }

    private async matchFrom(matchDAO: MatchDAO): Promise<Match> {

        const teams = await Promise.all(matchDAO.teams.map(teamDAO => this.teamFrom(teamDAO)))

        return new Match(
            teams,
            matchDAO.approved,
            matchDAO.timestamp,
            matchDAO._id!.toString(),
            await this.userRepository.getUserFromId(matchDAO.superApprovedBy?.toString()),
            matchDAO.superApproved
        );
    }

    private async teamFrom(teamDAO: TeamDAO): Promise<Team> {
        const players = await Promise.all(
            teamDAO.player.map(async player => {

                const user = await this.userRepository.getUserFromId(player.playerId.toString());
                return new Player(user!, player.hasApproved);
            })
        );

        return {
            players,
            score: teamDAO.score,
        };
    }

    private async dbMatchFrom(match: Match): Promise<MatchDAO> {

        return {
            _id: new ObjectId(match.id),
            approved: match.approved,
            superApproved: match.superApproved,
            superApprovedBy: new ObjectId((await this.userRepository.getUserFromUsername(match.superApprovedBy?.username))?.id),
            timestamp: match.timestamp,
            teams: await Promise.all(
                match.teams.map(team => this.dbTeamFrom(team))
            )
        };
    }

    private async dbTeamFrom(team: Team):Promise<TeamDAO> {
        return {
            score: team.score,
            player: await Promise.all(
                team.players.map(player => {
                    return {
                        hasApproved: player.hasApproved,
                        playerId: new ObjectId(player.id)
                    };
                })
            ),
        }
    }

    async getMatchesByUserId(userId: string): Promise<Match[]> {

        const query = {
            'teams.playersWithApproval': {
                $elemMatch: { playerId: new ObjectId(userId) }
            }
        };
        return (await this.retrieveMatches(query))
    }

    async getMatches(): Promise<Match[]> {

        return (await this.retrieveMatches({}))
    }

}