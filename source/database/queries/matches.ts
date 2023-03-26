import {collections} from "../database";
import {Match} from "../../models/models";
import {dbMatchFrom, matchFrom} from "../converters/matches";

export const insertMatch = async (match: Match) => {
    return collections.match!.insertOne(await dbMatchFrom(match))
}

export const getMatches = async (): Promise<Match[]> => {

    const dbMatches = await collections.match!.find().sort({timestamp: -1}).toArray();
    const matches = await Promise.all(dbMatches.map(dbMatch => matchFrom(dbMatch)));
    return matches;

}