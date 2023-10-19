import {Api} from "./Api";
import {createToken, login} from "../../services/security";
import {ErrorBody, LoginData, Token} from "../../models/models";
import e, {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {SecurityService} from "../security/SecurityService";

@injectable()
export class ApiImpl implements Api {

    constructor(@inject('SecurityService') private securityService: SecurityService) {}
    async login(req: e.Request<{}, {}, LoginData>, res: e.Response<Token | ErrorBody>): Promise<e.Response<ErrorBody> | e.Response<Token | ErrorBody>> { //TODO: to be reviewed the return type

        try {
            const user = await this.securityService.login(req.body.username, req.body.password)

            return res.status(200).json({token: createToken(user)});

        } catch (e: any) {
            return this.buildErrorResponse(res, e)
        }
    }

    private buildErrorResponse = (res:Response, e:any): Response<ErrorBody> => {
        return res.status(e.httpErrorCode||500).json({errorMessage:e.message})
    }

}