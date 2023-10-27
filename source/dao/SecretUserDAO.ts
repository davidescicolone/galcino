import {UserDAO} from "./UserDAO";

export interface SecretUserDAO extends UserDAO {
    encryptedPassword: string,
    salt: string,
}