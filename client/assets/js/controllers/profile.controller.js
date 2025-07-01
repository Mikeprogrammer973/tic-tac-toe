import { globals } from "../utils/globals.js"
import { Render } from "../utils/render.js"
import { controllers } from "./index.js"
import { profile_auth_init } from "../utils/init.js"

export default async function profile()
{
    let page_dir = "/pages/globals/denied.html" 

    let util = () => {}

    if(controllers.Auth.logged)
    {
        page_dir = "/pages/profile/profile.html" 
        util = profile_auth_init
    }

    await new Render().page(globals.game_board, page_dir, util)
}