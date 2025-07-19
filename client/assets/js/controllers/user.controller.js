import { toggle_ntf_modal, globals } from "../utils/globals.js"
import { Auth } from "./auth.controller.js"
import { Render } from "../utils/render.js"

const render = new Render()


export class User
{
    async update_profile(user_data)
    {
        globals.spinner(true)
        const result = await (await fetch("/api/user/update-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                full_name: user_data.get("full_name"),
                username: user_data.get("username"),
                email: user_data.get("email")
            })
        })).json()
        globals.spinner(false)
        
        if(result.username){
            Auth.user = result
            render.notification({
                title: "Tic Tac Toe",
                msg: "Profile updated successfully!",
                action: {
                    text: "Continue",
                    callback: () => {
                        toggle_ntf_modal(false)
                    }
                }
            })
        } else {
            render.notification({
                title: "Error",
                msg: result.message,
                action: {
                    text: "Retry",
                    callback: () => toggle_ntf_modal(false)
                }
            })
        }
    }

    async get_global_ranking(){
        globals.spinner(true)
        const rk_users = await (await fetch('/api/user/global-ranking')).json()
        globals.spinner(false)

        return rk_users
    }
}