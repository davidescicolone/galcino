import e, {Request, Response} from "express";
import {LoginData} from "../dto/LoginData";
import {SecretUserDTO} from "../dto/SecretUserDTO";
import {MatchDTO} from "../dto/MatchDTO";
import {Token} from "../dto/Token";
import {ErrorBody} from "../dto/ErrorBody";
import {UserDTO} from "../dto/UserDTO";
import {NextRequest, NextResponse} from "next/server";

export interface Api {
    login(req: NextRequest): Promise<NextResponse>
    postUser(req: NextRequest):Promise<NextResponse>
    searchUser(req: NextRequest):Promise<NextResponse>
    getMatch(req: NextRequest, params:any):Promise<NextResponse>
    postMatch(req: NextRequest):Promise<NextResponse>

         getMyMatches(req: NextRequest):Promise<NextResponse>
    /*    getMatchesByUserId(req: Request<{userId:string},{},{}>, res: Response<MatchDTO[] | ErrorBody>):void
        approveMatch(req: Request<{matchId:string}, {}, {}>, res: Response<ErrorBody>):void
        getMatches(req: Request<{}, {}, {}>, res: Response<ErrorBody>):void*/
}