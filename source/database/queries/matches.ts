import {collections} from "../database";
import {Match} from "../../models/models";
import {dbMatchFrom, matchFrom} from "../converters/matches";
import {ObjectId} from "mongodb";

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
            "teams.id": 1,
            "teams.playersWithApproval.approved": 1,
            "teams.playersWithApproval.player.id":
                "$teams.playersWithApproval.player._id",
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
                teamId: "$teams.id",
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


export const getMatches =  async (filter?:any): Promise<Match[]> => {


    let pipeline:any[] = filter ? [filter] : []

    const matches = await collections.match!.aggregate(pipeline.concat(dbMatchToMatchPipeline)).toArray() as Match[]

    return matches

}

export const getMatch = async (id:ObjectId): Promise<Match> => {

    const match = await collections.match!.findOne({_id: id})

    return matchFrom(match!)

}

export const updateMatch = async (match: Match) => {

    await collections.match!.replaceOne({_id: new ObjectId(match.id)},await dbMatchFrom(match))

}