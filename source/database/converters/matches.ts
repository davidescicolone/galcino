import {DBMatch} from "../models/models";
import {Match} from "../../models/models";
import {getDBUserFromUsername, getUser} from "../queries/users";
import {ObjectId} from "mongodb";
import {getUserIdFromUser} from "../../services/business/users";

export const dbMatchFrom = async (match: Match): Promise<DBMatch> => {

    return {
        _id: new ObjectId(match.id),
        approved: match.approved,
        superApproved: match.superApproved,
        superApprovedBy:  await getUserIdFromUser(match.superApprovedBy),
        timestamp: match.timestamp,
        teams: await Promise.all(
            match.teams!.map(async (team) => {
                return {
                    tempId: new ObjectId(),
                    score: team.score,
                    playersWithApproval: await Promise.all(
                        team.playersWithApproval.map(async (playerWithApproval) => {
                            return {
                                approved: playerWithApproval.approved,
                                playerId: (await getUserIdFromUser(playerWithApproval.player))!
                            };
                        })
                    ),
                };
            })
        )
    };
}