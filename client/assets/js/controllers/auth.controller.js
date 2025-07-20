import { toggle_ntf_modal, globals } from "../utils/globals.js"
import { set_route } from "../utils/navigation.js"
import { Render } from "../utils/render.js"

const render = new Render()

export class Auth 
{
    static logged = false
    static user = null

    async check()
    {
        globals.spinner(true)
        const result = await (await fetch("/api/auth/check", {
            method: "GET"
        })).json()
        globals.spinner(false)
        
        if(!result.message){
            Auth.logged = true
            Auth.user = result
        } else {
            Auth.logged = false
            Auth.user = null
        }

        return Auth.logged
    }

    async login(user_data)
    {
        globals.spinner(true)
        const result = await (await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: user_data.get("identifier"),
                password: user_data.get("password")
            })
        })).json()
        globals.spinner(false)

        if(result.requires2fa){
            render.notification({
                title: "2FA Authentication Required",
                msg: `<div class="space-y-2">
                        <label for="twofa-code" class="block text-sm font-medium text-gray-300">Type in your 6-digit 2FA Authentication code to continue.</label>
                        <input id="twofa-code" type="text" placeholder="123456"
                        class="w-full px-4 py-2 text-gray-50 border rounded-lg focus:ring focus:ring-blue-300 outline-none">
                    </div>
                `,
                action: {
                    text: "Continue",
                    callback: () => {
                        const code = document.getElementById('twofa-code').value
                        new Auth().login_2fa(user_data, code)
                    }
                }
            })
            return
        }

        if(result.username){
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

    async login_2fa(user_data, code)
    {
        globals.spinner(true)
        const result = await (await fetch("/api/auth/signin-2fa", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: user_data.get("identifier"),
                password: user_data.get("password"),
                code
            })
        })).json()
        globals.spinner(false)


        if(result.username){
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
        globals.spinner(true)
        const result = await (await fetch("/api/auth/signup", {
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
        globals.spinner(false)

        if(result.username){
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

    async logout()
    {
        globals.spinner(true)
        await fetch("/api/auth/signout", {
            method: "POST"
        })
        globals.spinner(false)
        Auth.redirect(["home", "Home"])
    }

    static redirect(route = ["profile", "Profile"])
    {
        set_route(route)
    }
}