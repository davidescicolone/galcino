import * as mongoDB from "mongodb";
import {MatchDAO} from "../dao/MatchDAO";
import {SecretUserDAO} from "../dao/SecretUserDAO";

export class MongoDB {

    private static mongoDB: MongoDB

    private constructor(public users: mongoDB.Collection<SecretUserDAO>,  public matches: mongoDB.Collection<MatchDAO>) {

    }
    static async getDB() {

        if(!this.mongoDB) {

            const client = new mongoDB.MongoClient(`${process.env["mongo_conn_string"]}`);
            await client.connect()
            const db = client.db()
            const users: mongoDB.Collection<SecretUserDAO> = db.collection("users");
            const matches: mongoDB.Collection<MatchDAO> = db.collection("matches");
            console.log(`Successfully connected to database: ${db.databaseName}`);
            MongoDB.mongoDB = new MongoDB(users, matches)
        }

        return MongoDB.mongoDB
    }
}