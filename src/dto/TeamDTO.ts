import {PlayerDTO} from "./PlayerDTO";

export interface TeamDTO {
    players: PlayerDTO [],
    score: number
}