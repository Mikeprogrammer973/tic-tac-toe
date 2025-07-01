import { Game } from "../utils/game/game.js"
import { Player } from "../utils/game/player.js"

export default async function vs_local_game()
{
    const game = new Game()
    const player = new Player('Player', 'X', game)
}