import {PlayerDAO} from "./PlayerDAO";

export interface TeamDAO {
    player:  PlayerDAO[],
    score: number
}