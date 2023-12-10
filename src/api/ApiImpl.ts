import {Api} from "./Api";
import e, {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {SecurityService} from "@/security/SecurityService";
import {MatchRepository} from "@/repositories/MatchRepository";
import {UserRepository} from "@/repositories/UserRepository";
import {DTOConverter} from "@/converters/DTOConverter";
import {LoginData} from "@/dto/LoginData";
import {Token} from "@/dto/Token";
import {ErrorBody} from "@/dto/ErrorBody";
import {SecretUserDTO} from "@/dto/SecretUserDTO";
import {BadRequest, UnauthorizedError} from "@/errors/errors";
import {UserDTO} from "@/dto/UserDTO";
import {MatchDTO} from "@/dto/MatchDTO";
import {NextRequest, NextResponse} from "next/server";

@injectable()
export class ApiImpl implements Api {

    constructor(
        @inject('SecurityService') private securityService: SecurityService,
        @inject('MatchRepository') private matchRepository: MatchRepository,
        @inject('UserRepository') private userRepository: UserRepository,
        @inject('DTOConverter') private converter: DTOConverter,
    ) {
    }

    async login(req: NextRequest): Promise<NextResponse> {
        try {
            const loginData : LoginData = await req.json()
            const user = await this.securityService.login(loginData.username, loginData.password)
            return NextResponse.json(
                {token: this.securityService.createToken(user)},
                {status:200}
            )
        } catch (e: any) {
            return this.buildErrorResponse(e)
        }
    }
    async postUser(req: NextRequest) {
        try {
            const requesterDTO = this.securityService.verifyToken(req.headers.get("Authorization")!)
            const requester = this.converter.userFrom(requesterDTO)
            if(!(requester!.isSuperUser())){
                throw new UnauthorizedError()
            }
            const secretUser = this.converter.secretUserFrom(await req.json())
            await this.userRepository.insertUser(secretUser)
            return new NextResponse(
                "",
                {status:200}
            )
        } catch (e: any) {
            return this.buildErrorResponse(e)
        }
    }

        async searchUser(req: NextRequest): Promise<NextResponse> {
            try {

                const query = req.nextUrl.searchParams.get("q")

                if(!query) {
                    throw new BadRequest()
                }

                const users = await this.userRepository.search(query)

                const usersDTO = users.map(it => this.converter.userDTOFrom(it))

                return NextResponse.json(
                    usersDTO,
                    {status:200}
                )

            } catch (e: any) {
                return this.buildErrorResponse(e)
            }
        }

    async getMatch(req: NextRequest, params:any):Promise<NextResponse> {

        try {

            const matchId = params.matchId

            if(!matchId) {
                throw new BadRequest()
            }

            const match = await this.matchRepository.getMatch(matchId)

            return NextResponse.json(
                this.converter.matchDTOFrom(match),
                {status:200}
            )
        } catch (e: any) {
            return this.buildErrorResponse(e)
        }
    };

            async postMatch(req: NextRequest): Promise<NextResponse> {

                try {

                    const userDTO = this.securityService.verifyToken(req.headers.get("Authorization")!)

                    let match = await this.converter.matchFrom(await req.json())

                    match.validate()

                    match.initialize()

                    match.approve(this.converter.userFrom(userDTO)!)

                    await this.matchRepository.insertMatch(match)

                    return new NextResponse(
                        "",
                        {status:200}
                    )
                } catch (e: any) {
                    return this.buildErrorResponse(e)
                }
            }



                   async getMyMatches(req: NextRequest):Promise<NextResponse> {
                       try {

                           const userDTO = this.securityService.verifyToken(req.headers.get("Authorization")!)

                           return this.internalGetMatchesByUserId(userDTO.id)

                       } catch (e: any) {
                           return this.buildErrorResponse(e)
                       }
                   }

    private async internalGetMatchesByUserId(userId: string) {

        const matches = await this.matchRepository.getMatchesByUserId(userId)

        //res.status(200).json(matches.map(it => this.converter.matchDTOFrom(it)))
        return NextResponse.json(
            matches.map(it => this.converter.matchDTOFrom(it)),
            {status: 200}
        )
    }
/*
                   async getMatchesByUserId(req: e.Request<{userId:string}, {}, {}>, res: e.Response<MatchDTO[] | ErrorBody>): Promise<void> {
                       try {

                           await this.internalGetMatchesByUserId(req.params.userId, res)

                       } catch (e: any) {
                           this.buildErrorResponse(res, e)
                       }
                   }




                           async approveMatch(req: e.Request<{matchId:string}, {}, {}>, res: e.Response<ErrorBody>): Promise<void> {
                               try {

                                   const userDTO = this.securityService.verifyToken(req.headers.authorization)

                                   const matchId = req.params.matchId

                                   let match = await this.matchRepository.getMatch(matchId)

                                   match.approve(this.converter.userFrom(userDTO)!)

                                   await this.matchRepository.updateMatch(match)

                                   res.status(200).json()

                               } catch (e: any) {
                                   this.buildErrorResponse(res, e)
                               }
                           }

                           async getMatches(req: e.Request<{}, {}, {}>, res: e.Response<MatchDTO[]|ErrorBody>): Promise<void> {
                               const matches = await this.matchRepository.getMatches()
                               const matchesDTO = matches.map(it => this.converter.matchDTOFrom(it))
                               res.status(200).json(matchesDTO)
                           }
                       */
    private buildErrorResponse = (e:any): NextResponse => {
        return new NextResponse(
            JSON.stringify({errorMessage:e.message}),
            { status: e.httpErrorCode||500 }
        )
    }
}