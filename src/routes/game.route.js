import e from "express"
import { add_game_log, get_games_log } from "../controllers/game.controller.js"
import auth_guardMiddleware from "../middlewares/auth.middleware.js"

const router = e.Router()

router.post("/add-game-log", auth_guardMiddleware, add_game_log)
router.get("/get-games-log", auth_guardMiddleware, get_games_log)

export default router
