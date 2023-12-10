import 'reflect-metadata';
import {Container, interfaces} from "inversify";
import {UserRepository} from "../repositories/UserRepository";
import {UserRepositoryImpl} from "../repositories/UserRepositoryImpl";
import {SecurityService} from "../security/SecurityService";
import {SecurityServiceImpl} from "../security/SecurityServiceImpl";
import {MatchRepository} from "../repositories/MatchRepository";
import {MatchRepositoryImpl} from "../repositories/MatchRepositoryImpl";
import {DTOConverter} from "../converters/DTOConverter";
import {DTOConverterImpl} from "../converters/DTOConverterImpl";
import {Api} from "@/api/Api";
import {ApiImpl} from "@/api/ApiImpl";
import {MongoDB} from "@/database/database";

const container = new Container();

container.bind<UserRepository>('UserRepository').to(UserRepositoryImpl);
container.bind<Api>('Api').to(ApiImpl);
container.bind<SecurityService>('SecurityService').to(SecurityServiceImpl);
container.bind<MatchRepository>('MatchRepository').to(MatchRepositoryImpl);
container.bind<DTOConverter>('DTOConverter').to(DTOConverterImpl);

export default container;