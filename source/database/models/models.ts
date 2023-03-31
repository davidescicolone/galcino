import {SimpleUser, UserType} from "../../models/models";
import {ObjectId} from "mongodb";

export interface DBUser {
    _id?: ObjectId
    firstName: string,
    lastName: string,
    encryptedPassword: string,
    username: string,
    salt: string,
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