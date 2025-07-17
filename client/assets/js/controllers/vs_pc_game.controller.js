import { Game } from "../utils/game/game.js"
import { PC } from "../utils/game/pc.js"

export default async function vs_pc_game()
{
    const game = new Game("pc")
    const pc = new PC('O', game)

    game.players.push(pc)
    game.reset_game()
}