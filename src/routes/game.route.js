import e from "express"
import { add_game_log } from "../controllers/game.controller.js"
import auth_guardMiddleware from "../middlewares/auth.middleware.js"

const router = e.Router()

router.post("/add-game-log", auth_guardMiddleware, add_game_log)

export default router
