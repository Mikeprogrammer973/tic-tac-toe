import { globals } from "../utils/globals.js"
import { Render } from "../utils/render.js"
import { Auth } from "./auth.controller.js"

export default async function settings()
{
    let page_dir = "/pages/globals/denied.html" 

    if(new Auth().check())
    {
        page_dir = "/pages/settings/settings.html" 
    }

    await new Render().page(globals.game_board, page_dir)
}