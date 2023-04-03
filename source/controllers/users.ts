import {Request, Response} from "express";
import {ErrorBody, SecretUser, SimpleUser} from "../models/models";
import {buildErrorResponse} from "../services/errors";
import {insertUser, searchUsers} from "../database/queries/users";
import {initializeUserService} from "../services/business/users";
import {collections} from "../database/database";

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