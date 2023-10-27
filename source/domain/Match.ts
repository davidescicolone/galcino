
import {Team} from "./Team";
import {User} from "./User";
import {UnauthorizedError} from "../errors/errors";

export class Match {
    constructor(
        public teams: Team[],
        public approved: boolean,
        public timestamp: Date,
        public id?:string,
        public superApprovedBy?: User,
        public superApproved: boolean = false
    ) {}
    public approve(user:User) {

        if (!this.isUserEntitled(user)) {
            throw new UnauthorizedError()
        }

        if(user.isSuperUser()) {
            this.approved = true
            this.superApproved = true
            this.superApprovedBy = user
        } else {
            this.teams.forEach(team => team.players.forEach(player => player.hasApproved = (player.hasApproved || user.username==player.username)))
            this.approved = this.approved || this.teams.flatMap(team => team.players).filter(player => !player.hasApproved).length == 0
        }
    }
    public initialize() {
        this.timestamp = new Date()
    }

    public validate() {

        const twoTeams = this.teams.length == 2

        if (!twoTeams) {
            throw new Error("match not valid")
        }

        const oneWinner = this.teams.filter(team => {
            return team.score == 10;
        }).length == 1

        if (!oneWinner) {
            throw new Error("match not valid")
        }

        const players = this.teams.flatMap(team => team.players.map(player => player.username))

        const playersNumber = players.length

        if (playersNumber != 4) {
            throw new Error("match not valid")
        }

        const hasDuplicatePlayers = new Set(players).size !== playersNumber;

        if (hasDuplicatePlayers) {
            throw new Error("match not valid")
        }
    }

    private isUserEntitled(user:User) {

        if (user.isSuperUser()) {
            return true
        }

        const players = this.teams.flatMap(team =>
            team.players.map( player => player.username)
        );

        return players.includes(user.username);
    }
}