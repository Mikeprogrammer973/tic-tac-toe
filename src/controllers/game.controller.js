import Game from "../models/game.model.js"

export const add_game_log = (req, res) => {
    try {
        const { mode, vs, init, end, result } =  req.body
        const user = req.user

        const game_log = new Game({
            userId: user._id,
            mode,
            vs,
            date: {
                init,
                end
            },
            result
        })

        let pts = 0

        switch(result)
        {
            case 1:
                let bonus = 2.007

                if(mode == "online") bonus += 7.07
                if(mode == "local") bonus += 5.07
                if(mode == "pc" && vs == "Bot 3") bonus += 3.07

                pts = Math.floor(((result * 100 * (user.stats.level + 1)) / 7) * bonus)
                break
            case 0:
                pts = 7 * (user.stats.level + 1)
                break
            default:
                pts = -7 * (user.stats.level + 1)
        }

        user.stats.xp += pts
        user.stats.nxt_lv_xp._current += pts

        if(user.stats.nxt_lv_xp._current >= user.stats.nxt_lv_xp._goal)
        {
            user.stats.level += 1
            user.stats.nxt_lv_xp._current = 0
            user.stats.nxt_lv_xp._goal *= user.stats.level + 1
        }

        game_log.save()
        user.save()

        res.status(201).json(game_log)
    } catch (error) {
        
    }
}

export const get_games_log = (req, res) => {
    try {
        const user = req.user

        Game.find({userId: user._id})
        .then(games => {
            res.status(200).json(games)
        })
    } catch (error) {
        console.error("Get games log controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}