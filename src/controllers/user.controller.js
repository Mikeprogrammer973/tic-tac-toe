
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

        user.games.push(game_log)

        user.save()

        res.status(201).json(game_log)
    } catch (error) {
        
    }
}