import e, {Request, Response} from "express";
import {ErrorBody, LoginData, Token} from "../../models/models";

export interface Api {
    login(req: Request<{},{},LoginData>, res: Response<Token|ErrorBody>):Promise<e.Response<ErrorBody> | e.Response<Token | ErrorBody>>
}