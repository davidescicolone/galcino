import {Request, Response} from "express";
import {buildErrorResponse} from "../services/errors";
import {ErrorBody, LoginData, Token} from "../models/models";
import {createToken, login} from "../services/security";

export const loginApi = async (req: Request<{},{},LoginData>, res: Response<Token|ErrorBody>) => {

    try {
        const user = await login(req.body.username,req.body.password)

        return res.status(200).json({token: createToken(user)});

    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
};