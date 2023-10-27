import {Api} from "./Api";
import e, {Request, Response} from "express";
import {inject, injectable} from "inversify";
import {SecurityService} from "../security/SecurityService";
import {MatchRepository} from "../repositories/MatchRepository";
import {UnauthorizedError} from "../errors/errors";
import {UserRepository} from "../repositories/UserRepository";
import {DTOConverter} from "../converters/DTOConverter";
import {MatchDTO} from "../dto/MatchDTO";
import {SecretUserDTO} from "../dto/SecretUserDTO";
import {LoginData} from "../dto/LoginData";
import {Token} from "../dto/Token";
import {ErrorBody} from "../dto/ErrorBody";
import {UserDTO} from "../dto/UserDTO";

@injectable()
export class ApiImpl implements Api {

    constructor(
        @inject('SecurityService') private securityService: SecurityService,
        @inject('MatchRepository') private matchRepository: MatchRepository,
        @inject('UserRepository') private userRepository: UserRepository,
        @inject('DTOConverter') private converter: DTOConverter,
    ) {
    }

    async login(req: e.Request<{}, {}, LoginData>, res: e.Response<Token | ErrorBody>) {
        try {
            const user = await this.securityService.login(req.body.username, req.body.password)
            res.status(200).json({token: this.securityService.createToken(user)});
        } catch (e: any) {
            this.buildErrorResponse(res, e)
        }
    }
    async postUser(req: Request<{}, {}, SecretUserDTO>, res: Response<ErrorBody>) {
        try {
            const requesterDTO = this.securityService.verifyToken(req.headers.authorization)
            const requester = this.converter.userFrom(requesterDTO)
            if(!(requester!.isSuperUser())){
                throw new UnauthorizedError()
            }
            const secretUser = this.converter.secretUserFrom(req.body)
            await this.userRepository.insertUser(secretUser)
            res.status(200).json()
        } catch (e: any) {
            this.buildErrorResponse(res, e)
        }
    }

    async searchUser(req: e.Request<{}, {}, {},{q:string}>, res: e.Response<UserDTO[] | ErrorBody>): Promise<void> {
        try {

            const query: string = req.query.q

            const users = await this.userRepository.search(query)

            const usersDTO = users.map(it => this.converter.userDTOFrom(it))

            res.status(200).json(usersDTO)

        } catch (e: any) {
            this.buildErrorResponse(res, e)
        }
    }

    async postMatch(req: e.Request<{}, {}, MatchDTO>, res: e.Response<ErrorBody>) {

        try {

            const userDTO = this.securityService.verifyToken(req.headers.authorization)

            let match = await this.converter.matchFrom(req.body)

            match.validate()

            match.initialize()

            match.approve(this.converter.userFrom(userDTO)!)

            await this.matchRepository.insertMatch(match)

            res.status(200).json()

        } catch (e: any) {
            this.buildErrorResponse(res, e)
        }
    }

    async getMatch(req: Request<{matchId:string}, {}, {}>, res: Response<MatchDTO | ErrorBody>) {

        try {

            const matchId = req.params.matchId

            const match = await this.matchRepository.getMatch(matchId)

            res.status(200).json(this.converter.matchDTOFrom(match))

        } catch (e: any) {
            this.buildErrorResponse(res, e)
        }
    };

    async getMyMatches(req: e.Request<{}, {}, {}>, res: e.Response<MatchDTO[] | ErrorBody>): Promise<void> {
        try {

            const userDTO = this.securityService.verifyToken(req.headers.authorization)

            await this.internalGetMatchesByUserId(userDTO.id,res)

        } catch (e: any) {
            this.buildErrorResponse(res, e)
        }
    }

    async getMatchesByUserId(req: e.Request<{userId:string}, {}, {}>, res: e.Response<MatchDTO[] | ErrorBody>): Promise<void> {
        try {

            await this.internalGetMatchesByUserId(req.params.userId, res)

        } catch (e: any) {
            this.buildErrorResponse(res, e)
        }
    }

    private async internalGetMatchesByUserId(userId: string, res: e.Response<MatchDTO[] | ErrorBody>) {

        const matches = await this.matchRepository.getMatchesByUserId(userId)

        res.status(200).json(matches.map(it => this.converter.matchDTOFrom(it)))

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

    private buildErrorResponse = (res:Response, e:any): Response<ErrorBody> => {
        return res.status(e.httpErrorCode||500).json({errorMessage:e.message})
    }
}