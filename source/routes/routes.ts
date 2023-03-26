import express from 'express'
import {connectToDatabase} from "../database/database";
import {loginApi} from "../controllers/loginApi";
import {getMatches, postMatch} from "../controllers/matches";
import {postUser} from "../controllers/users";
const router = express.Router()

connectToDatabase()
    .then(() => {
        router.post("/login", loginApi)
        router.post("/matches", postMatch)
        router.get("/matches", getMatches)
        router.post("/users", postUser)
        console.info("server started")
    })

export = router