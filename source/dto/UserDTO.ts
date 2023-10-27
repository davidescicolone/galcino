import {UserType} from "../domain/User";


export interface UserDTO {
    firstName: string,
    lastName: string,
    username: string,
    type: UserType,
    id: string,
}