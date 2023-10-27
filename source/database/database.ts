import * as mongoDB from "mongodb";
import {MatchDAO} from "../dao/MatchDAO";
import {SecretUserDAO} from "../dao/SecretUserDAO";

export const collections: {
    users?: mongoDB.Collection<SecretUserDAO>
    matches?: mongoDB.Collection<MatchDAO>
} = {};

export async function connectToDatabase() {
    const client = new mongoDB.MongoClient(`${process.env["mongo_conn_string"]}`);
    await client.connect()
    const db = client.db()
    collections.users = db.collection("users");
    collections.matches = db.collection("matches");
    console.log(`Successfully connected to database: ${db.databaseName}`);
}
