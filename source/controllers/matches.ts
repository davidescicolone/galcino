import {Request, Response} from "express";
import {buildErrorResponse, UnauthorizedError} from "../services/errors";
import {ErrorBody, Match} from "../models/models";
import {verifyToken} from "../services/security";
import {approveMatchService, getMatchService, initializeMatchService, isValid} from "../services/business/matches";
import {ObjectId} from "mongodb";
import {isSuperUser, isUserEntitled} from "../services/business/users";
import {getMatchesByUserId, getMatchesService, insertMatch, updateMatch} from "../database/queries/matches";

export const approveMatch = async (req: Request<any, {}, {}>, res: Response<ErrorBody>) => {

    try {
        const user = verifyToken(req.headers.authorization)

        const matchId:string = req.params.matchId

        let match = await getMatchService(matchId)

        match = approveMatchService(user, match)

        await updateMatch(match)

    } catch (e: any) {
        return buildErrorResponse(res, e)
    }
}

export const postMatch = async (req: Request<{}, {}, Match>, res: Response<ErrorBody>) => {

    try {

        const user = verifyToken(req.headers.authorization)

        let match = req.body

        if (!isValid(match)) {
            throw new Error("match not valid")
        }

        if (!isUserEntitled(user, match)) {
            throw new UnauthorizedError()
        }

        match = initializeMatchService(match)

        match = approveMatchService(user,match)

        await insertMatch(match)

        res.status(200).json()

    } catch (e: any) {
        return buildErrorResponse(res, e)
    }
};

export const getMatch = async (req: Request<any, {}, {}>, res: Response<Match | ErrorBody>) => {

    try {

        const matchId = req.params.matchId

        const match = await getMatchService(matchId)

        res.status(200).json(match)

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
};

export const getMatches = async (req: Request<{}, {}, {}>, res: Response<Match[] | ErrorBody>) => {

    try {

        const matches = await getMatchesService()

        res.status(200).json(matches)

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
};

export const getMyMatches = async (req: Request<{}, {}, {}>, res: Response<Match[] | ErrorBody>) => {

    try {

        const user = verifyToken(req.headers.authorization)

        const matches = getMatchesByUserId(user.id!)

        res.status(200).json(matches)

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
};