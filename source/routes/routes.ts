import express from 'express'
import {connectToDatabase} from "../database/database";
import {login} from "../controllers/login";
const router = express.Router()

connectToDatabase()
    .then(() => {
        router.post('/login', login)
        console.info("server started")
    })

export = router