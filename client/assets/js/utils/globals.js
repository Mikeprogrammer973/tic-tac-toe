import { EmojiButton } from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.4/dist/index.js';

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
    },
    chat: {
        container: document.getElementById('chat'),
        box_container: document.getElementById('chat-box-container'),
        send_msg_form: document.getElementById('chat-send-msg-form'),
        msg_input: document.getElementById('chat-msg-input'),
        toggle: (visible) => {
            globals.chat.container.classList.toggle("hidden", !visible)
        },
        config: () => {
            globals.chat.box_container.innerHTML = ""
            globals.chat.msg_input.value = ""

            globals.chat.send_msg_form.addEventListener('submit', (e) => {
                e.preventDefault()
                const msg = globals.chat.msg_input.value
                console.log(msg)
                globals.chat.msg_input.value = ""
            })

            // Emoji cfg
            const picker = new EmojiButton({
                position: 'top-start',
                zIndex: 50,
                theme: 'dark'
            });
        
            const trigger = document.querySelector('#chat-emoji-btn');
            const input = document.querySelector('#chat-msg-input');
        
            picker.on('emoji', emoji => {
                input.value += emoji.emoji;
                input.focus();
            });
        
            trigger.addEventListener('click', () => picker.togglePicker(trigger));
        }
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


