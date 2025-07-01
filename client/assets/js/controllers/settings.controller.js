import { globals } from "../utils/globals.js"
import { Render } from "../utils/render.js"
import { controllers } from "./index.js"

export default async function settings()
{
    let page_dir = "/pages/globals/denied.html" 

    if(controllers.Auth.logged)
    {
        page_dir = "/pages/settings/settings.html" 
    }

    await new Render().page(globals.game_board, page_dir)
}