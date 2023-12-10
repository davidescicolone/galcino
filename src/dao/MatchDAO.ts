import {ObjectId} from "mongodb";
import {TeamDAO} from "./TeamDAO";

export interface MatchDAO {
    _id: ObjectId
    superApproved: boolean,
    superApprovedBy: ObjectId
    approved: boolean,
    timestamp: Date,
    teams: TeamDAO[]
}