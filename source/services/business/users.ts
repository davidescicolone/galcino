import {getDBUserFromUsername} from "../../database/queries/users";
import {Match, SimpleUser} from "../../models/models";
import {ObjectId} from "mongodb";

export const getUserIdFromUser = async (user?: SimpleUser):Promise<ObjectId|undefined> => {

    if(user === undefined) {
        return undefined
  }

    return user.id ? new ObjectId(user.id) : (await getDBUserFromUsername(user.username))._id

}

export const approveUserService = (user: SimpleUser): SimpleUser => {
    user.approved = true
    return user
}

export const initializeUserService = <T extends SimpleUser> (user: T): T => {
    user.type = "standard"
    user.approved = false

    return user
}
export const isSuperUser = (user: SimpleUser): boolean => {

    return user.type == "admin"
}
export const isUserEntitled = (user: SimpleUser, match: Match): boolean => {

  if (isSuperUser(user)) {
        return true
  }

  const players = match.teams.flatMap((team) =>
    team.playersWithApproval.map((players) => players.player.username)
  );

  return players.includes(user.username);
};