import express from 'express'
import {connectToDatabase} from "../database/database";
import {loginApi} from "../controllers/loginApi";
import {approveMatch, getMatches, getMyMatches, postMatch} from "../controllers/matches";
import {postUser} from "../controllers/users";
const router = express.Router()

connectToDatabase()
    .then(() => {
        router.post("/login", loginApi)
        router.post("/matches", postMatch)
        router.post("/matches/:matchId/approve", approveMatch)
        router.get("/matches", getMatches)
        router.post("/users", postUser)
        router.get("/users/me/matches", getMyMatches)
        console.info("server started")
    })

export = router