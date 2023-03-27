import {Request, Response} from "express";
import {buildErrorResponse, UnauthorizedError} from "../services/errors";
import {ErrorBody, Match} from "../models/models";
import {verifyToken} from "../services/security";
import {isSuperUser, isUserEntitled, isValid} from "../services/validations";
import {getMatch, getMatches as getMatchesFromDB, insertMatch, updateMatch} from "../database/queries/matches";
import {verify} from "jsonwebtoken";
import {approveMatchService} from "../services/matches";

export const approveMatch = async (req: Request<any, {}, {}>, res: Response<ErrorBody>) => {

    try {
        const user = verifyToken(req.headers.authorization)

        const matchId = req.params.matchId

        let match = await getMatch(matchId)

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

        match = approveMatchService(user,match)

        await insertMatch(match)

        res.status(200).json()

    } catch (e: any) {
        return buildErrorResponse(res, e)
    }
};

export const getMatches = async (req: Request<{}, {}, {}>, res: Response<Match[] | ErrorBody>) => {

    try {

        const matches = await getMatchesFromDB()

        res.status(200).json(matches)

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
};