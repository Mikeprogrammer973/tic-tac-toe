import { Auth } from "./auth.controller.js";
import home from "./home.controller.js";
import profile from "./profile.controller.js";
import settings from "./settings.controller.js";
import vs_pc_game from "./vs_pc_game.controller.js";
import vs_local_game from "./vs_local_game.controller.js";
import vs_online_game from "./vs_online_game.controller.js";

export const controllers = {
    home,
    profile,
    Auth,
    settings,
    vs_pc_game,
    vs_local_game,
    vs_online_game
}