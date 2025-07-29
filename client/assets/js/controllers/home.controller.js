import { globals } from "../utils/globals.js"
import { home_auth_init, _teste_msg } from "../utils/init.js"
import { Render } from "../utils/render.js"
import { controllers } from "./index.js"

export default async function home()
{
    let page_dir = "/pages/home/welcome.html" 

    let util = _teste_msg
    
    if(!controllers.Auth.logged)
    {
        page_dir = "/pages/home/auth_forms.html"
        util = home_auth_init
    }

    await new Render().page(globals.game_board, page_dir, util)
}