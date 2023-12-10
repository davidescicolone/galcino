import {ObjectId} from "mongodb";

export interface PlayerDAO {
    playerId: ObjectId,
    hasApproved: boolean
}