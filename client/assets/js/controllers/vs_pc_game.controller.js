import { Game } from "../utils/game/game.js"
import { PC } from "../utils/game/pc.js"
import { Render } from "../utils/render.js"

export default async function vs_pc_game()
{
    const game = new Game("pc")

    const pc = new PC('O', game, 1)

    game.players.push(pc)
    game.reset_game()

    new Render().notification(
        {
            title: "Level Selection",
            msg: `
                <div class="space-y-2 my-5">
                    <label for="level" class="block text-sm font-medium text-gray-300">Select a level:</label>
                    <select id="level" class="w-full px-4 py-2 text-gray-100 border rounded-lg focus:ring focus:ring-blue-300 outline-none">
                        <option class="text-indigo-600" value="1">Easy</option>
                        <option class="text-indigo-600" value="2" selected>Medium</option>
                        <option class="text-indigo-600" value="3">Hard</option>
                    </select>
                </div>
            `,
            action: {
                text: "Continue",
                callback: () => {
                    const game = new Game("pc")

                    const pc = new PC('O', game, document.getElementById('level').value)

                    game.players.push(pc)
                    game.reset_game()
                }
            }
        }
    )
}