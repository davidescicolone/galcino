import {Request, Response} from "express";
import {buildErrorResponse, UnauthorizedError} from "../services/errors";
import {ErrorBody, Match} from "../models/models";
import {verifyToken} from "../services/security";
import {isUserEntitled, isValid} from "../services/validations";
import {getMatches as getMatchesFromDB, insertMatch} from "../database/queries/matches";

export const postMatch = async (req: Request<{}, {}, Match>, res: Response<ErrorBody>) => {

    try {

        const user = verifyToken(`${req.headers.authorization}`)

        const match = req.body

        if (!isValid(match)) {
            throw new Error("match not valid")
        }

        if (!isUserEntitled(user, match)) {
            throw new UnauthorizedError()
        }

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