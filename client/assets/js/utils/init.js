import { controllers } from '../controllers/index.js' 
import { format_xp } from './globals.js';
import { Render } from './render.js';

const render = new Render()

export const home_auth_init = () => {
    const signinTab = document.getElementById('tab-signin');
    const signupTab = document.getElementById('tab-signup');
    const signinForm = document.getElementById('form-signin');
    const signupForm = document.getElementById('form-signup');

    signinTab.addEventListener('click', () => {
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        signinTab.classList.add('bg-indigo-600');
        signupTab.classList.remove('bg-indigo-600');
        signupTab.classList.add('bg-gray-800');
        signinTab.classList.remove('bg-gray-800');
    });

    signupTab.addEventListener('click', () => {
        signupForm.classList.remove('hidden');
        signinForm.classList.add('hidden');
        signupTab.classList.add('bg-indigo-600');
        signinTab.classList.remove('bg-indigo-600');
        signinTab.classList.add('bg-gray-800');
        signupTab.classList.remove('bg-gray-800');
    });

    // Handle Auth forms submit
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form_data = new FormData(e.currentTarget)
        new controllers.Auth().login(form_data)
    })

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form_data = new FormData(e.currentTarget);
        new controllers.Auth().register(form_data)
    })
}

export const profile_auth_init = async () => {
    const user = controllers.Auth.user

    document.getElementById('username').innerText = user.username
    document.getElementById('name').innerText = user.fullName
    document.getElementById('xp').innerText = format_xp(user.stats.xp)
    document.getElementById('level').innerText = user.stats.level

    const games = {
        pc: user.games.filter(game => game.mode == "pc"),
        local: user.games.filter(game => game.mode == "local"),
        online: user.games.filter(game => game.mode == "online")
    }

    for(let game of Object.keys(games)){
        document.getElementById(`${game}-wins`).innerText = games[game].filter(game => game.result == 1).length
        document.getElementById(`${game}-draws`).innerText = games[game].filter(game => game.result == 0).length
        document.getElementById(`${game}-losses`).innerText = games[game].filter(game => game.result == -1).length
    }

    const nxt_lv_p = Math.floor((((user.stats.xp / (1000 * (user.stats.level + 1) * 7)) * 100) / 2))

    document.getElementById("next-lv-p").style.width = `${nxt_lv_p}%`
    document.getElementById("next-lv-pp").innerText = `${nxt_lv_p}`

    document.getElementById('logout-btn').addEventListener('click', () => {
        new controllers.Auth().logout()
    })

    document.getElementById('get-gb-rk').addEventListener('click', async () => {
        const rk_users = (await new controllers.User().get_global_ranking()).sort((a, b) => {
            if (b.stats.level !== a.stats.level) return b.stats.level - a.stats.level;
            return b.stats.xp - a.stats.xp;
        })

        let rk_content = ''

        rk_users.forEach((rk_user, index) => {
            rk_content += `<div class="bg-gray-800 flex items-center justify-between gap-4 p-2 rounded-lg">
                <div class=" flex items-center gap-4 p-2">
                    <img src="https://i.pravatar.cc/150?u=user123" alt="Avatar"
                    class="w-16 h-16 rounded-full border-4 border-indigo-500 shadow-lg" />
                    <div>
                        <p title="${rk_user.username}" class="text-gray-200 text-lg max-w-32 overflow-hidden text-ellipsis"> ${rk_user.username} </p>
                        <p title="${rk_user.fullName}" class="max-w-32 overflow-hidden text-ellipsis text-gray-300 text-sm"> ${rk_user.fullName} </p>
                    </div>
                    <div>
                        <p title="${format_xp(rk_user.stats.xp)}" class="text-gray-200 text-lg max-w-32 overflow-hidden text-ellipsis text-indigo-300"> ${format_xp(rk_user.stats.xp)}</p>
                        <p title="Lv ${rk_user.stats.level}" class="max-w-32 overflow-hidden text-ellipsis text-gray-300 text-sm">Lv ${rk_user.stats.level} </p>
                    </div>
                </div>
                <p class="text-2xl rounded-lg text-white bg-indigo-500 p-2">#${index + 1}</p>
            </div>
            `
        })

        document.getElementById('global-rk').innerHTML = rk_content
    })

    
}

export const settings_auth_init = () => {
    const user = controllers.Auth.user
    const user_controller = new controllers.User()

    const account_form = document.getElementById('account-form')
    const privacy_form = document.getElementById('privacy-form')
    

    account_form.elements[0].value = user.fullName
    account_form.elements[1].value = user.username
    account_form.elements[2].value = user.email

    account_form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const form_data = new FormData(e.currentTarget)
        await user_controller.update_profile(form_data)
    })

    privacy_form.elements[0].checked = user.prefs._public

    privacy_form.addEventListener('submit', async (e) => {
        e.preventDefault()
        await user_controller.update_profile_privacy(new FormData(e.currentTarget))
    })

    user.prefs._2fa ? document.getElementById('disable-2fa-btn').classList.remove('hidden') : document.getElementById('enable-2fa-btn').classList.remove('hidden')

    document.getElementById('enable-2fa-btn').addEventListener('click', async () => {
        const {secret, qr} = await user_controller.get_2fa_secret()

        render.notification({
            title: "Enable 2FA Authentication",
            msg:`<div class="flex justify-center my-4">
                    <img id="qrcode-img" src="${qr}" alt="QR Code" class="rounded-lg border p-2">
                </div>

                <div class="space-y-2">
                    <label for="twofa-code" class="block text-sm font-medium text-gray-300">Type in your 6-digit code</label>
                    <input id="twofa-code" type="text" placeholder="123456"
                    class="w-full px-4 py-2 text-gray-50 border rounded-lg focus:ring focus:ring-blue-300 outline-none">
                </div>
            `,
            action: {
                text: "Enable",
                callback: async () => {
                    const code = document.getElementById('twofa-code').value
                    await user_controller.verify_2fa_code({secret, code})
                }
            }
        })
    })

    document.getElementById('disable-2fa-btn').addEventListener('click', async () => {
        await user_controller.disable_2fa()
    })

}