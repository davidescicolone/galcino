import {UserDTO} from "./UserDTO";

export interface SecretUserDTO extends UserDTO{
    password: string
}
