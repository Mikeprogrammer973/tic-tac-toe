import { globals } from "../utils/globals.js"
import { Render } from "../utils/render.js"
import { controllers } from "./index.js"
import { settings_auth_init } from "../utils/init.js"

export default async function settings()
{
    let page_dir = "/pages/globals/denied.html" 

    let util = () => {}

    if(controllers.Auth.logged)
    {
        page_dir = "/pages/settings/settings.html" 
        util = settings_auth_init
    }

    await new Render().page(globals.game_board, page_dir, util)
}