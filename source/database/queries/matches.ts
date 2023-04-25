import {collections} from "../database";
import {Match} from "../../models/models";
import {dbMatchFrom} from "../converters/matches";
import {Document, ObjectId} from "mongodb";

export const insertMatch = async (match: Match) => {
    return collections.match!.insertOne(await dbMatchFrom(match))
}

const dbMatchToMatchPipeline:any[] = [
    {
        $unwind: "$teams",
    },
    {
        $unwind: "$teams.playersWithApproval",
    },
    {
        $lookup: {
            from: "users",
            localField:
                "teams.playersWithApproval.playerId",
            foreignField: "_id",
            as: "teams.playersWithApproval.player",
        },
    },
    {
        $unwind: "$teams.playersWithApproval.player",
    },
    {
        $project: {
            approved: 1,
            superApproved: 1,
            superApprovedBy: 1,
            timestamp: 1,
            "teams.score": 1,
            "teams.tempId": 1,
            "teams.playersWithApproval.approved": 1,
            "teams.playersWithApproval.player.id": "$teams.playersWithApproval.player._id",
            "teams.playersWithApproval.player.username": 1,
            "teams.playersWithApproval.player.firstName": 1,
            "teams.playersWithApproval.player.lastName": 1,
            "teams.playersWithApproval.player.type": 1,
            "teams.playersWithApproval.player.approved": 1,
        },
    },
    {
        $group: {
            _id: {
                id: "$_id",
                teamId: "$teams.tempId",
            },
            score: {
                $first: "$teams.score",
            },
            approved: {
                $first: "$approved",
            },
            superApproved: {
                $first: "$superApproved",
            },
            superApprovedBy: {
                $first: "$superApprovedBy",
            },
            timestamp: {
                $first: "$timestamp",
            },
            playersWithApproval: {
                $push: "$teams.playersWithApproval",
            },
        },
    },
    {
        $project: {
            _id: "$_id.id",
            approved: 1,
            superApproved: 1,
            superApprovedBy: 1,
            timestamp: 1,
            "teams.score": "$score",
            "teams.tempId": "$_id.teamId",
            "teams.playersWithApproval":
                "$playersWithApproval",
        },
    },
    {
        $group: {
            _id: "$_id",
            approved: {
                $first: "$approved",
            },
            superApproved: {
                $first: "$superApproved",
            },
            superApprovedBy: {
                $first: "$superApprovedBy",
            },
            timestamp: {
                $first: "$timestamp",
            },
            teams: {
                $push: "$teams",
            },
        },
    },
    {
        $addFields: {
            id: "$_id",
        },
    },
    {
        $project: {
            _id: 0,
        },
    },
]

export const getMatchesByUserId = async (userId: string): Promise<Match[]> => {
    return await getMatchesService({"teams.playersWithApproval.playerId": new ObjectId(userId)})
}

export const getMatchesService =  async (filter?:Document): Promise<Match[]> => {

    let pipeline:Document[] = filter ? [{$match:filter}] : []

    const matches = await collections.match!.aggregate(pipeline.concat(dbMatchToMatchPipeline)).toArray() as Match[]

    return matches

}


export const updateMatch = async (match: Match) => {

    await collections.match!.replaceOne({_id: new ObjectId(match.id)},await dbMatchFrom(match))

}