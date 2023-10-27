import express from 'express'
import {connectToDatabase} from "../database/database";
import container from "../di/container";
import {Api} from "../api/Api";
import * as path from "path";
const router = express.Router()

connectToDatabase()
    .then(() => {

        router.use(express.static(path.join(__dirname, '../app/galcino-app/build')))

        const api = container.get<Api>('Api');

        router.post('/login', (req,res) => {
              api.login(req,res)
        });

        router.post("/users", (req,res) => {
            api.postUser(req,res)
        });

        router.get("/users/search", (req,res) => {
            api.searchUser(req,res)
        });

        router.post("/matches", (req,res) => {
            api.postMatch(req,res)
        });

        router.get("/matches/:matchId", (req,res) => {
            api.getMatch(req,res)
        });

        router.get("/users/me/matches", (req,res) => {
            api.getMyMatches(req,res)
        });

        router.get("/users/:userId/matches", (req,res) => {
            api.getMatchesByUserId(req,res)
        });

        router.post("/matches/:matchId/approve", (req,res) => {
            api.approveMatch(req,res)
        });

        router.get("/matches", (req,res) => {
            api.getMatches(req,res)
        });

        console.info("server started");
})

export = router