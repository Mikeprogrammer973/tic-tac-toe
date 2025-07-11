import { Game } from "../utils/game/game.js"
import { Player } from "../utils/game/player.js"
import { PC } from "../utils/game/pc.js"

export default async function vs_pc_game()
{
    const game = new Game()
    const pc = new PC('O', game)

    game.players.push(pc)
    game.reset_game()

    console.log(game);
}