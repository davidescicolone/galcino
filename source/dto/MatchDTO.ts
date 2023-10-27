import {Team} from "../domain/Team";
import {User} from "../domain/User";
import {TeamDTO} from "./TeamDTO";
import {UserDTO} from "./UserDTO";

export interface MatchDTO {
    teams: TeamDTO[],
    approved: boolean,
    timestamp: Date,
    superApprovedBy?: UserDTO,
    superApproved: boolean,
    id?: string
}