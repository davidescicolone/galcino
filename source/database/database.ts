import * as mongoDB from "mongodb";
import {User} from "./models/models";

export const collections: {
    users?: mongoDB.Collection<User>
} = {};

export async function connectToDatabase() {
    const client = new mongoDB.MongoClient(`${process.env["mongo_conn_string"]}`);
    await client.connect()
    const db = client.db()
    collections.users = db.collection("users");
    console.log(`Successfully connected to database: ${db.databaseName}`);
}