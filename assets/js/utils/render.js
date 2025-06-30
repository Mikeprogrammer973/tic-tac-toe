import { globals, toggle_ntf_modal } from "../utils/globals.js"

export class Render
{
    notification({title, msg, action: {text, callback}})
    {
        globals.notification.title.innerHTML = title
        globals.notification.msg.innerHTML = msg
        globals.notification.action.innerHTML = text
        globals.notification.action.onclick = callback
        toggle_ntf_modal(true)
    }

    async page(el, dir, util = () => {})
    {
        el.innerHTML = await (await fetch(dir)).text()
        util()
    }
}