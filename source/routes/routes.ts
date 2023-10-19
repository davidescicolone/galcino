import express from 'express'
import {connectToDatabase} from "../database/database";
import {loginApi} from "../controllers/loginApi";
import {
      approveMatch,
      getMatch,
      getMatches,
      getMyMatches,
      getMyMatchesToBeApproved,
      postMatch
} from "../controllers/matches";
import {approveUser, getAllUsers, postUser, searchUsersApi} from "../controllers/users";
import container from "../oo/di/container";
import {Api} from "../oo/api/Api";
const router = express.Router()

connectToDatabase()
    .then(() => {

          const api = container.get<Api>('Api');

          router.post('/login', (req, res) => {
                api.login(req, res);
          });

          router.post("/matches", postMatch);
          router.get("/matches/:matchId", getMatch);
          router.post("/matches/:matchId/approve", approveMatch);
          router.get("/matches", getMatches);
          router.post("/users", postUser);
          router.post("/users/:userId/approve", approveUser);
          router.get("/users/search", searchUsersApi);
          router.get("/users/me/matches", getMyMatches);
          router.get("/users/me/matches/to-be-approved", getMyMatchesToBeApproved);
          router.get("/users", getAllUsers);
          console.info("server started");
    })

export = router