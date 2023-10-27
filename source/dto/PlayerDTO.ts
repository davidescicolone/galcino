import {UserDTO} from "./UserDTO";

export interface PlayerDTO extends UserDTO {
    hasApproved:boolean
}