import { Game } from "../utils/game/game.js"
import { Player } from "../utils/game/player.js"

export default async function vs_local_game()
{
    const game = new Game("local")
    const opponent = new Player(prompt("Player 2 name: "), 'O', game)
    opponent.mySelf = false

    game.players.push(opponent)
    game.reset_game()

    console.log(game);
}