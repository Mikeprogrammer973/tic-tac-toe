import { Game } from "../utils/game/game.js"

export default async function vs_online_game()
{
    const game = new Game("online")

    console.log(game);
}