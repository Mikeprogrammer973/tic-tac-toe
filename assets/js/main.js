import { config_navigation } from "./utils/navigation.js"
import { toggle_ntf_modal } from "./utils/globals.js"

config_navigation()

window.onload = () => {
    document.getElementById("ntf-close-btn").addEventListener("click", () => {
        toggle_ntf_modal(false)
    })
    document.getElementById("ntf-cancel-btn").addEventListener("click", () => {
        toggle_ntf_modal(false)
    })
}
