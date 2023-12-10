export class HttpError extends Error {

    private httpErrorCode: number;

    constructor(httpErrorCode:number,message:string,) {
        super(message)
        this.httpErrorCode = httpErrorCode
    }
}


export class UnauthorizedError extends HttpError {

    constructor() {
        super(401, "Unauthorized")
    }
}

export class BadRequest extends HttpError {

    constructor() {
        super(400, "Bad Request")
    }
}