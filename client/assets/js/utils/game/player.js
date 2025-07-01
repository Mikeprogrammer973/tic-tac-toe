import { Game } from "./game.js";

export class Player
{
    constructor(name, symbol, game = new Game())
    {
        this.name = name;
        this.symbol = symbol;
        this.game = game;
    }

    play(move)
    {
        this.game.make_move(move.row, move.col)

        if(this.game.game_over)
        {
            console.log(`${this.name} wins!`);
        }
    }
}