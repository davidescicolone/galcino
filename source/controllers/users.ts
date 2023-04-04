import {Request, Response} from "express";
import {ErrorBody, SecretUser, SimpleUser} from "../models/models";
import {buildErrorResponse, UnauthorizedError} from "../services/errors";
import {getUser, insertUser, searchUsers, updateUser} from "../database/queries/users";
import {approveUserService, initializeUserService, isSuperUser} from "../services/business/users";
import {collections} from "../database/database";
import {verifyToken} from "../services/security";
import {approveMatchService, getMatchService} from "../services/business/matches";
import {ObjectId} from "mongodb";
import {updateMatch} from "../database/queries/matches";
import {partialDBUserFrom} from "../database/converters/users";

export const approveUser = async (req: Request<any, {}, {}>, res: Response<ErrorBody>) => {

    try {

        if(isSuperUser(verifyToken(req.headers.authorization))) {
            const userId: string = req.params.userId

            let user = await getUser(new ObjectId(userId))

            user = approveUserService(user)

            await updateUser(user)

            return res.status(200).json()
        }

        throw new UnauthorizedError()

    } catch (e: any) {
        return buildErrorResponse(res, e)
    }
}


export const postUser = async (req: Request<{},{},SecretUser>, res: Response<ErrorBody>) => {

    try {

        const user = initializeUserService(req.body)

        await insertUser(user)

        res.status(200).json()

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
}

export const searchUsersApi = async (req: Request<{},{},{},any>, res: Response<ErrorBody|SimpleUser[]>) => {

    try {

        const query:string = req.query.q

        const users = await searchUsers(query)

        res.status(200).json(users)

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
}