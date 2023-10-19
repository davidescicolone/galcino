import {verifyToken} from "../../services/security";
import {SimpleUser} from "../../models/models";
import {UnauthorizedError} from "../../services/errors";
import jwt from "jsonwebtoken";

export interface SecurityService {
    verifyToken (authorizationHeader?: string):SimpleUser
    login (username: string, password: string): Promise<SimpleUser>
}