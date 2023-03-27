import {DBMatch} from "../models/models";
import {Match} from "../../models/models";
import {getDBUserFromUsername, getUser} from "../queries/users";

export const matchFrom = async (dbMatch: DBMatch): Promise<Match> => {
    const teams = await Promise.all(dbMatch.teams.map(async team => {
        const playersWithApproval = await Promise.all(team.playersWithApproval.map(async playerWithApproval => {
            return {
                approved: playerWithApproval.approved,
                player: await getUser(playerWithApproval.playerId)
            };
        }));
        return {
            score: team.score,
            playersWithApproval: playersWithApproval
        };
    }));
    return {
        approved: dbMatch.approved,
        superApproved: dbMatch.superApproved,
        superApprovedBy: dbMatch.superApprovedBy ? await getUser(dbMatch.superApprovedBy) : undefined,
        teams: teams
    };
};

export const dbMatchFrom = async (match: Match): Promise<DBMatch> => {

    return {
        approved: match.approved,
        superApproved: match.superApproved,
        superApprovedBy:  match.superApprovedBy?.username ? (await getDBUserFromUsername(match.superApprovedBy.username))?._id : undefined,
        teams: await Promise.all(
            match.teams!.map(async (team) => {
                return {
                    score: team.score,
                    playersWithApproval: await Promise.all(
                        team.playersWithApproval.map(async (playerWithApproval) => {
                            const user = await getDBUserFromUsername(playerWithApproval.player.username!);
                            return {
                                approved: playerWithApproval.approved,
                                playerId: user._id!,
                            };
                        })
                    ),
                };
            })
        )
    };
}