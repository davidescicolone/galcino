import {Request, Response} from "express";
import {collections} from "../database/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {buildErrorResponse, UnauthorizedError} from "../services/errors";
import {ErrorBody, LoginData, Token} from "../models/models";

export const login = async (req: Request<{},{},LoginData>, res: Response<Token|ErrorBody>) => {

    try {
        const user = await collections.users?.findOne({username:req.body.username})

        if(!user) {
            throw new UnauthorizedError()
        }

        if(await bcrypt.hash(req.body.password, user.salt) == user?.encryptedPassword) {
            const token = jwt.sign({userId:user._id},`${process.env["jwt_secret"]}`)
            return res.status(200).json({token:token});
        }

        throw new UnauthorizedError()
    } catch (e:any) {
        return buildErrorResponse(res,e)
    }
};