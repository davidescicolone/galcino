import * as mongoDB from "mongodb";
import {DBMatch, DBUser} from "./models/models";

export const collections: {
    users?: mongoDB.Collection<DBUser>
    match?: mongoDB.Collection<DBMatch>
} = {};

export async function connectToDatabase() {
    const client = new mongoDB.MongoClient(`${process.env["mongo_conn_string"]}`);
    await client.connect()
    const db = client.db()
    collections.users = db.collection("users");
    collections.match = db.collection("matches");
    console.log(`Successfully connected to database: ${db.databaseName}`);
}
