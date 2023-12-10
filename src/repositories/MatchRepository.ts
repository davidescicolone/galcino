import {Match} from "../domain/Match";

export interface MatchRepository {
    insertMatch(match:Match):void
    updateMatch(match:Match):void
    getMatch(matchId:string):Promise<Match>
    getMatchesByUserId(userId:string):Promise<Match[]>
    getMatches():Promise<Match[]>
}