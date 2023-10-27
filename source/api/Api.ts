import e, {Request, Response} from "express";
import {LoginData} from "../dto/LoginData";
import {SecretUserDTO} from "../dto/SecretUserDTO";
import {MatchDTO} from "../dto/MatchDTO";
import {Token} from "../dto/Token";
import {ErrorBody} from "../dto/ErrorBody";
import {UserDTO} from "../dto/UserDTO";

export interface Api {
    login(req: Request<{},{},LoginData>, res: Response<Token|ErrorBody>):void
    postUser(req: Request<{},{},SecretUserDTO>, res: Response<ErrorBody>):void
    searchUser(req: Request<{},{},{},{}>, res: Response<UserDTO[]|ErrorBody>):void
    postMatch(req: Request<{}, {}, MatchDTO>, res: Response<ErrorBody>):void
    getMatch(req: Request<{matchId:string}, {}, {}>, res: Response<MatchDTO | ErrorBody>):void
    getMyMatches(req: Request<{},{},{}>, res: Response<MatchDTO[] | ErrorBody>):void
    getMatchesByUserId(req: Request<{userId:string},{},{}>, res: Response<MatchDTO[] | ErrorBody>):void
    approveMatch(req: Request<{matchId:string}, {}, {}>, res: Response<ErrorBody>):void
    getMatches(req: Request<{}, {}, {}>, res: Response<ErrorBody>):void
}