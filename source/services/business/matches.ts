import {Match, SimpleUser} from "../../models/models";
import {isSuperUser} from "./users";
import {ObjectId} from "mongodb";
import {getMatchesService} from "../../database/queries/matches";

export const getMatchService = async (id: string): Promise<Match> => {
    return (await getMatchesService({_id: new ObjectId(id)}))[0]
}

export const initializeMatchService = (match: Match) => {
    match.timestamp = new Date()
    return match
}

export const approveMatchService = (user: SimpleUser, match: Match): Match => {

    //TODO: implements error in case the user is not entitled to approve this match

    if(isSuperUser(user)) {
        match.approved = true
        match.superApproved = true
        match.superApprovedBy = user
    } else {
        match.teams.forEach(team => team.playersWithApproval.forEach(player => player.approved = player.approved || user.username==player.player.username))
        match.approved = match.teams.filter(team => team.playersWithApproval.filter(playerWithApproval => !playerWithApproval.approved)).length == 0
        match.superApproved = false
    }

    return match
}

export const isValid = (match: Match): boolean => {

    const twoTeams = match.teams.length == 2

    if (!twoTeams) {
        return false
    }

    const oneWinner = match.teams.filter(team => {
        return team.score == 10;
    }).length == 1

    if (!oneWinner) {
        return false
    }

    const players = match.teams.flatMap(team => team.playersWithApproval.map(player => player.player.username))

    const playersNumber = players.length

    if (playersNumber != 4) {
        return false
    }

    const hasDuplicatePlayers = new Set(players).size !== playersNumber;

    if (hasDuplicatePlayers) {
        return false
    }

    return true
}