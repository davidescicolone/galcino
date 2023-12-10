import {UserRepository} from "./UserRepository";
import {inject, injectable} from "inversify";
import {SecretUser, User} from "../domain/User";
import {Document, Filter, ObjectId} from "mongodb";
import {UserDAO} from "../dao/UserDAO";
import {UnauthorizedError} from "../errors/errors";
import {SecretUserDAO} from "../dao/SecretUserDAO";
import {MongoDB} from "@/database/database";
import bcrypt from "bcrypt";
@injectable()
export class UserRepositoryImpl implements UserRepository {
    async search(query: string): Promise<User[]> {
        //TODO: to be verified how to leverage on the index to query on all the three fields (lastName,firstName,username) in one shot

        const users = (await MongoDB.getDB()).users

        const queryByLastName = users.aggregate(this.searchStage(query, "lastName")).toArray()

        const queryByFirstName = users.aggregate(this.searchStage(query, "firstName")).toArray()

        const queryByUsername = users.aggregate(this.searchStage(query, "username")).toArray()

        const userDAOList = this.distinctUnion(await queryByLastName as UserDAO[], await queryByFirstName as UserDAO[], await queryByUsername as UserDAO[])

        return userDAOList.map(userDAO => this.userFrom(userDAO)!)
    }

    private searchStage (query:string, path:string):Document[] {

        return [{
            $search: {
                index: "default",
                autocomplete: {
                    query: query,
                    path: path
                }
            }
        }]
    }

    private async getSecretDBUser(filter: Filter<any>): Promise<SecretUserDAO|undefined> {
        const secretDBUser = await (await MongoDB.getDB()).users.findOne(filter)
        if(secretDBUser) {
            return secretDBUser
        }
        return undefined;
    }

    async getUserFromUsername(username?: string): Promise<User|undefined> {
        const secretDBUser = await this.getSecretDBUser({username: username});
        return this.userFrom(secretDBUser);
    }

    async getUserFromId(id: string): Promise<User | undefined> {
        const secretDBUser = await this.getSecretDBUser({_id: new ObjectId(id)});
        return this.userFrom(secretDBUser);
    }

    private userFrom(dbUser?:UserDAO|null):User|undefined {

        if(!dbUser) {
            return undefined
        }

        return new User (
            dbUser.firstName,
            dbUser.lastName,
            dbUser.username,
            dbUser.type,
            dbUser._id.toString()
        )
    }

    async insertUser(secretUser: SecretUser) {
        const secretDBUser: SecretUserDAO = await this.secretDBUserFrom(secretUser)
        await (await MongoDB.getDB()).users.insertOne(secretDBUser)
    }

    private async secretDBUserFrom(secretUser: SecretUser): Promise<SecretUserDAO> {

        const salt = await bcrypt.genSalt(12)

        const secretDBUser = <SecretUserDAO>this.dbUserFromUser(secretUser)

        secretDBUser.encryptedPassword = await bcrypt.hash(secretUser.password, salt)
        secretDBUser.salt = salt

        return secretDBUser
    }

    async getUserFromCredentials(username: string, password: string): Promise<User | undefined> {
        const secretDBUser = await this.getSecretDBUser({username: username})

        if (!secretDBUser) {
            throw new UnauthorizedError()
        }

        if (await bcrypt.hash(password, secretDBUser.salt) == secretDBUser.encryptedPassword) {
            return this.userFrom(secretDBUser)
        }

        throw new UnauthorizedError()
    }

    public async updateUser(user: User): Promise<void> {
        //TODO: understand how to manage the errors
        const existingSecretDBUser = await this.getSecretDBUser({username: user.username})
        const inputDBUser = this.dbUserFromUser(user)
        const updatedDBUser = this.merge(existingSecretDBUser!, inputDBUser)

        await (await MongoDB.getDB()).users.replaceOne({_id: new ObjectId(inputDBUser._id)}, updatedDBUser)

    }

    private merge(existingDBUser: SecretUserDAO, updatedDBUser:UserDAO ):SecretUserDAO {
        //TODO: to check how to refactor it
        const finalDBUser = <SecretUserDAO>updatedDBUser
        finalDBUser.encryptedPassword = existingDBUser.encryptedPassword
        finalDBUser.salt = existingDBUser.salt

        return finalDBUser
    }

    private dbUserFromUser(user: User): UserDAO {

        return {
            _id: new ObjectId(user.id),
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            type: user.type
        }
    }

    private distinctUnion (...userArrays:UserDAO[][]):UserDAO[] {

        const users = userArrays.flat()

        const dedupUsers:UserDAO[] = []

        users.forEach(user => {

            if(!this.exists(user,dedupUsers)) {
                dedupUsers.push(user)
            }
        })

        return dedupUsers
    }

    private exists(user:UserDAO, array: UserDAO[]):boolean {
        return !!array.find(it => it._id.toString() == user._id.toString())
    }
}