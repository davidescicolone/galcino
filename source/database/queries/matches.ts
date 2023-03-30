import {collections} from "../database";
import {Match} from "../../models/models";
import {dbMatchFrom, matchFrom} from "../converters/matches";
import {ObjectId} from "mongodb";

export const insertMatch = async (match: Match) => {
    return collections.match!.insertOne(await dbMatchFrom(match))
}

export const getMatches = async (): Promise<Match[]> => {

    const dbMatches = await collections.match!.find().sort({timestamp: -1}).toArray();
    const matches = Promise.all(dbMatches.map(dbMatch => matchFrom(dbMatch)));
    return matches;

}

export const getMatch = async (id:ObjectId): Promise<Match> => {

    const match = await collections.match!.findOne({_id: id})

    return matchFrom(match!)

}

export const updateMatch = async (match: Match) => {

    await collections.match!.replaceOne({_id: new ObjectId(match.id)},await dbMatchFrom(match))

}