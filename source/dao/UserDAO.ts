import {ObjectId} from "mongodb";
import {UserType} from "../domain/User";

export interface UserDAO {
    _id: ObjectId
    firstName: string,
    lastName: string,
    username: string,
    type: UserType
}