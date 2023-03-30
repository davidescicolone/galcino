import {Request, Response} from "express";
import {ErrorBody, SecretUser} from "../models/models";
import {buildErrorResponse} from "../services/errors";
import {insertUser} from "../database/queries/users";
import {initializeUserService} from "../services/business/users";

export const postUser = async (req: Request<{},{},SecretUser>, res: Response<ErrorBody>) => {

    try {

        const user = initializeUserService(req.body)

        await insertUser(user)

        res.status(200).json()

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
}