import { controllers } from '../controllers/index.js' 

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

export const profile_auth_init = () => {
    const user = controllers.Auth.user

    document.getElementById('username').innerText = user.username
    document.getElementById('name').innerText = user.fullName
    document.getElementById('xp').innerText = user.stats.xp
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

    const nxt_lv_p = Math.floor((((user.stats.xp / (1000 * (user.stats.level + 1))) * 100) / 2))

    document.getElementById("next-lv-p").style.width = `${nxt_lv_p}%`
    document.getElementById("next-lv-pp").innerText = `${nxt_lv_p}`

    document.getElementById('logout-btn').addEventListener('click', () => {
        new controllers.Auth().logout()
    })
}

export const settings_auth_init = () => {
    const user = controllers.Auth.user
    const user_controller = new controllers.User()

    const account_form = document.getElementById('account-form')
    //const password_form = document.getElementById('password-form')

    account_form.elements[0].value = user.fullName
    account_form.elements[1].value = user.username
    account_form.elements[2].value = user.email

    account_form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const form_data = new FormData(e.currentTarget)
        await user_controller.update_profile(form_data)
    })
}