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

    async update_profile_privacy(user_data)
    {
        const prms = {
            _public: user_data.get("public") == "on" ? true : false
        }

        globals.spinner(true)
        const result = await (await fetch("/api/user/update-profile-privacy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prms)
        })).json()
        globals.spinner(false)
        
        if(result.username){
            Auth.user = result 
            render.notification({
                title: "Tic Tac Toe",
                msg: "Profile privacy updated successfully!",
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

    async get_2fa_secret()
    {
        globals.spinner(true)
        const result = await (await fetch("/api/user/generate-2fa-secret")).json()
        globals.spinner(false)

        return result
    }

    async verify_2fa_code(user_data)
    {
        const prms = {
            secret: user_data.secret,
            code: user_data.code
        }

        globals.spinner(true)
        const result = await (await fetch("/api/user/verify-2fa-code", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prms)
        })).json()
        globals.spinner(false)
        
        if(result.username){
            Auth.user = result
            render.notification({
                title: "Tic Tac Toe",
                msg: "2FA Authentication enabled successfully!",
                action: {
                    text: "Continue",
                    callback: () => {
                        toggle_ntf_modal(false)
                    }
                }
            })
            document.getElementById('enable-2fa-btn').classList.add('hidden')
            document.getElementById('disable-2fa-btn').classList.remove('hidden')
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

    async disable_2fa()
    {
        globals.spinner(true)
        const result = await (await fetch("/api/user/disable-2fa-auth")).json()
        globals.spinner(false)
        
        if(result.username){
            Auth.user = result
            render.notification({
                title: "Tic Tac Toe",
                msg: "2FA Authentication disabled successfully!",
                action: {
                    text: "Continue",
                    callback: () => {
                        toggle_ntf_modal(false)
                    }
                }
            })
            document.getElementById('enable-2fa-btn').classList.remove('hidden')
            document.getElementById('disable-2fa-btn').classList.add('hidden')
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