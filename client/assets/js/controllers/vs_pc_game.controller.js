import { Game } from "../utils/game/game.js"
import { PC } from "../utils/game/pc.js"
import { Render } from "../utils/render.js"

export default async function vs_pc_game()
{
    let game = new Game("pc")
    let level = 1

    let pc = new PC('O', game, level)

    game.players.push(pc)
    game.reset_game()
    
    new Render().notification(
        {
            title: "Level Selection",
            msg: `
                <div class="space-y-2 my-5">
                    <label for="level" class="block text-sm font-medium text-gray-300">Select a level:</label>
                    <select id="level" class="w-full px-4 py-2 text-gray-100 border rounded-lg focus:ring focus:ring-blue-300 outline-none">
                        <option class="text-indigo-600" value="1" selected>Easy</option>
                        <option class="text-indigo-600" value="2">Medium</option>
                        <option class="text-indigo-600" value="3">Hard</option>
                    </select>
                </div>
            `,
            action: {
                text: "Continue",
                callback: () => {
                    game = new Game("pc")
                    level = Number(document.getElementById('level').value)

                    pc = new PC('O', game, level)

                    game.players.push(pc)
                    game.reset_game()
                }
            }
        }
    )
}