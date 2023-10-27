export type UserType = "admin"|"standard"
export class User {

    public isSuperUser():boolean {
        return this.type == "admin"
    }

    constructor(
        public firstName: string,
        public lastName: string,
        public username: string,
        public type: UserType,
        public id: string
    ) {}
}

export class SecretUser extends User {
    constructor(
        firstName: string,
        lastName: string,
        username: string,
        type: UserType,
        public password: string,
        id: string,
    ) {
        super (firstName, lastName, username, type, id)
    }
}