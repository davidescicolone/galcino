import {Request, Response} from "express";
import {ErrorBody, SecretUser} from "../models/models";
import {buildErrorResponse} from "../services/errors";
import {insertUser} from "../database/queries/users";

export const postUser = async (req: Request<{},{},SecretUser>, res: Response<ErrorBody>) => {

    try {

        await insertUser(req.body)

        res.status(200).json()

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
}