import express from "express"
import { check_auth, list_sessions, revoke_session, signin, signin_2fa, signout, signup } from "../controllers/auth.controller.js"
import auth_guardMiddleware from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/signin-2fa", signin_2fa)
router.post("/signout", auth_guardMiddleware, signout)

router.get("/list-sessions", auth_guardMiddleware, list_sessions)
router.post("/revoke-session/:id", auth_guardMiddleware, revoke_session)

router.get("/check", auth_guardMiddleware, check_auth)

export default router