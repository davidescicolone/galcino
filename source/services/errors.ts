import {Response} from "express";
import {ErrorBody} from "../models/models";

export const buildErrorResponse = (res:Response, e:any): Response<ErrorBody> => {
    return res.status(e.httpErrorCode||500).json({errorMessage:e.message})
}

export class HttpError extends Error {

    private httpErrorCode: number;

    constructor(httpErrorCode:number,message:string,) {
        super(message)
        this.httpErrorCode = httpErrorCode
    }
}

export class UnauthorizedError extends HttpError {

    constructor() {
        super(401, "unauthorized")
    }
}