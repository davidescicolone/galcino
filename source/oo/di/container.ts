import 'reflect-metadata';
import {Container} from "inversify";
import {UserRepository} from "../repositories/UserRepository";
import {UserRepositoryImpl} from "../repositories/UserRepositoryImpl";
import {Api} from "../api/Api";
import {ApiImpl} from "../api/ApiImpl";
import {SecurityService} from "../security/SecurityService";
import {SecurityServiceImpl} from "../security/SecurityServiceImpl";

const container = new Container();

container.bind<UserRepository>('UserRepository').to(UserRepositoryImpl);
container.bind<Api>('Api').to(ApiImpl);
container.bind<SecurityService>('SecurityService').to(SecurityServiceImpl);

export default container;