
export const add_game_log = (req, res) => {
    try {
        const { mode, vs, init, end, result } =  req.body
        const user = req.user

        const game_log = {
            mode,
            vs,
            date: {
                init,
                end
            },
            result
        }

        switch(result)
        {
            case 1:
                let bonus = 2.007

                if(mode == "online") bonus += 7.07
                if(mode == "local") bonus += 5.07
                if(mode == "pc" && vs == "Bot 3") bonus += 3.07

                user.stats.xp += Math.floor(((result * 100 * (user.stats.level + 1)) / 7) * bonus)
                break
            case 0:
                user.stats.xp += 7 * (user.stats.level + 1)
                break
            default:
                user.stats.xp -= 7 * (user.stats.level + 1)
        }

        const lv_up = (Math.floor(user.stats.xp / (1000 * (user.stats.level + 1) * 7))) - 1
        user.stats.level += lv_up > 0 ? lv_up : 0

        user.games.push(game_log)

        user.save()

        res.status(201).json(game_log)
    } catch (error) {
        
    }
}