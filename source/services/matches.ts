import {isSuperUser} from "./validations";
import {Match, SimpleUser} from "../models/models";

export const approveMatchService = (user: SimpleUser, match: Match): Match => {

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

