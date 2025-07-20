
const game_board = document.getElementById("game-board")
const ntf_modal_container = document.getElementById("notification-modal")
const ntf_modal_title = document.getElementById("ntf-title")
const ntf_modal_msg = document.getElementById("ntf-msg")
const ntf_modal_action = document.getElementById("ntf-action-btn")
const spinner = document.getElementById("spinner")


export const globals = {
    game_board,
    notification: {
        container: ntf_modal_container,
        title: ntf_modal_title,
        msg: ntf_modal_msg,
        action: ntf_modal_action
    },
    spinner: (show) => {
        spinner.classList.toggle("hidden", !show)
    }
}

export function toggle_ntf_modal(show) {
    globals.notification.container.classList.toggle("hidden", !show);
}

export function format_xp(xp) {
    let formatted_xp = xp
    
    if(xp >= 1000)
    {
        formatted_xp = (xp / 1000).toFixed(2) + "K"
    } else if(xp >= 1000000){
        formatted_xp = (xp / 1000000).toFixed(2) + "M"
    } else if(xp >= 1000000000){
        formatted_xp = (xp / 1000000000).toFixed(2) + "B"
    }

    return formatted_xp
}


