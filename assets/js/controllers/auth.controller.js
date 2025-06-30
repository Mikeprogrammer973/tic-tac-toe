import { toggle_ntf_modal } from "../utils/globals.js"
import { set_route } from "../utils/navigation.js"
import { Render } from "../utils/render.js"

const render = new Render()

export class Auth 
{
    static logged = false

    check()
    {
        return Auth.logged
    }

    async login(user_data)
    {
        const result = await (await fetch("http://127.0.0.1:5001/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: user_data.get("identifier"),
                password: user_data.get("password")
            })
        })).json()

        if(result.username){
            Auth.logged = true
            render.notification({
                title: "Tic Tac Toe",
                msg: "Welcome back, " + result.username + "!",
                action: {
                    text: "Continue",
                    callback: () => {
                        toggle_ntf_modal(false)
                    }
                }
            })
            Auth.redirect()
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

    async register(user_data)
    {
        const result = await (await fetch("http://127.0.0.1:5001/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: user_data.get("fullName"),
                email: user_data.get("email"),
                username: user_data.get("username"),
                password: user_data.get("password")
            })
        })).json()

        if(result.username){
            Auth.logged = true
            render.notification({
                title: "Tic Tac Toe",
                msg: "Welcome, " + result.username + "!",
                action: {
                    text: "Continue",
                    callback: () => {
                        toggle_ntf_modal(false)
                    }
                }
            })
            Auth.redirect()
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

    logout()
    {
        Auth.logged = false
    
    }

    static redirect()
    {
        set_route(["profile", "Profile"])
    }
}