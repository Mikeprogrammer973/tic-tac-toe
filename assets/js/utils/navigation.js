import { routes } from "./routes.js"

function handle_navigation()
{
    set_route([Object.keys(routes)[1], routes[Object.keys(routes)[1]][1]])
    for(let route of Object.keys(routes))
    {
        document.getElementById(route).addEventListener('click', (el) => {
            document.title = routes[route][1]
            location.replace(`#/${route}`)
        })
    }
}

function handle_current_navigation()
{
    const route = (window.location.hash || "#/").split('#/')[1]
    console.log(route)
}

export function set_route(route)
{
    document.title = route[1]
    location.replace(`#/${route[0]}`)
}

export function config_navigation()
{
    window.addEventListener("DOMContentLoaded", handle_navigation)
    window.addEventListener("hashchange", handle_current_navigation)
}

