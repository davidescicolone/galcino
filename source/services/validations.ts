import {SimpleUser, Match} from "../models/models";

export const isUserEntitled = (user: SimpleUser, match: Match): boolean => {

        if(isSuperUser(user)) {
            return true
        }

        return match.teams!.filter(team =>
            team.playersWithApproval.filter(player => {
                return player.player.username == user.username;
            })
                .length > 0)
            .length > 0

}

export const isValid = (match: Match):boolean => {

    const twoTeams = match.teams.length == 2

    if(!twoTeams) {
        return false
    }

    const oneWinner = match.teams.filter(team => {
        return team.score == 10;
    }).length == 1

    if(!oneWinner) {
        return false
    }

    const players = match.teams.flatMap(team => team.playersWithApproval.map(player => player.player.username))

    const playersNumber = players.length

    if(playersNumber != 4) {
        return false
    }

    const hasDuplicatePlayers = new Set(players).size !== playersNumber;

    if(hasDuplicatePlayers) {
        return false
    }

    return true
}

export const isSuperUser = (user: SimpleUser):boolean => {

    return user.type == "admin"
}