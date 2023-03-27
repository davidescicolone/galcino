export interface ErrorBody {
    errorMessage: string
}

export interface Token {
    token: string
}

export interface LoginData {
    username: string,
    password: string
}

export interface SimpleUser {
    id?: string,
    username: string,
    firstName?: string,
    lastName?: string,
    type?: UserType,
    approved: boolean,
}

export interface SecretUser extends SimpleUser {
    password: string
}

export type UserType = "standard" | "admin"

interface Team {
    playersWithApproval:  {
        player: SimpleUser,
        approved: boolean
    }[],
    score: number
}

export interface Match {
    id?: string
    teams: Team[],
    superApproved: boolean,
    superApprovedBy?: SimpleUser
    approved: boolean,
}