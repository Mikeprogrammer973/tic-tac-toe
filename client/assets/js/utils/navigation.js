import { controllers } from "../controllers/index.js"
import { handle_controller } from "./controller_handler.js"
import { routes } from "./routes.js"

function handle_navigation()
{
    let slt_route = localStorage.getItem("ttt_slt_route")
    if(!slt_route) slt_route = Object.keys(routes)[0]
    
    set_route([slt_route, routes[slt_route][1]])

    for(let route of Object.keys(routes))
    {
        document.getElementById(route).addEventListener('click', (el) => {
            document.title = routes[route][1]
            set_route([route, routes[route][1]])
        })
    }
}

function handle_current_navigation()
{
    const route = (window.location.hash || "#/").split('#/')[1]
    localStorage.setItem("ttt_slt_route", route)
    document.title = routes[route][1]
    set_selected_menu(route)
    handle_controller(route)
}

export function set_route(route)
{
    document.title = route[1]
    location.assign(`#/${route[0]}`)
    set_selected_menu(route[0])
}

export function set_selected_menu(menu_item_id)
{
    const slt_class = "bg-gray-900 text-white font-bold hover:bg-gray-700 cursor-pointer p-2 rounded-md flex items-center gap-3"
    const no_slt_class = "text-gray-600 hover:bg-gray-200 hover:text-gray-400 cursor-pointer p-2 rounded-md flex items-center gap-3"

    for (const id of Object.keys(routes)) {
        document.getElementById(id).setAttribute("class", no_slt_class)
        if(menu_item_id === id) document.getElementById(id).setAttribute("class", slt_class)
    }
}

export function config_navigation()
{
    window.addEventListener("DOMContentLoaded", handle_navigation)
    window.addEventListener("hashchange", handle_current_navigation)
    window.addEventListener("load", handle_current_navigation)
}

