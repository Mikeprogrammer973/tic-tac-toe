import { Game } from "../utils/game/game.js"
import { controllers } from "./index.js"
import { Render } from "../utils/render.js"
import { globals } from "../utils/globals.js"


export default async function vs_online_game()
{
    if(controllers.Auth.logged)
    {
        const game = new Game("online")
        globals.chat.config()
    } else {
        new Render().notification({
            title: "Error",
            msg: "You must be logged in to play online.",
            action: {
                text: "Login",
                callback: () => controllers.Auth.redirect(["home", "Home"])
            }
        })
        new Render().page(globals.game_board, "/pages/globals/denied.html")
    }
}