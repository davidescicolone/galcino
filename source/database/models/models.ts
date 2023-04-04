import {SimpleUser, UserType} from "../../models/models";
import {ObjectId} from "mongodb";

export interface DBUser extends PartialDBUser {
    encryptedPassword: string,
    salt: string,
}

export interface PartialDBUser {
    _id?: ObjectId
    firstName: string,
    lastName: string,
    username: string,
    approved: boolean,
    type: UserType
}

interface DBTeam {
    playersWithApproval:  {
        playerId: ObjectId,
        approved: boolean
    }[],
    tempId: ObjectId
    score: number
}

export interface DBMatch {
    _id?: ObjectId
    superApproved: boolean,
    superApprovedBy?: ObjectId
    approved: boolean,
    timestamp: Date,
    teams: DBTeam[]
}