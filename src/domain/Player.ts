import {User} from "./User";

export class Player extends User {

    constructor(
        user:User,
        public hasApproved:boolean,
    ) {
        super(user.firstName,user.lastName,user.username,user.type,user.id)
    }
}