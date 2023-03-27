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

interface Team {
    playersWithApproval:  {
        playerId: ObjectId,
        approved: boolean
    }[],
    score: number
}

export interface DBMatch {
    superApproved: boolean,
    superApprovedBy?: ObjectId
    approved: boolean,
    teams: Team[]
}