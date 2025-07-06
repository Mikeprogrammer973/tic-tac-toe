import { Game } from "./game.js";

export class PC
{
    constructor(symbol, game, level = 1)
    {
        this.name = "Bot"
        this.symbol = symbol;
        this.game = game;
        this.isBot = true;
        this.level = level;
        this.move = null;

        switch(this.level)
        {
            case 1:
                this.move = this.make_random_move;
                break;
            case 2:
                this.move = this.make_thoughty_move;
                break;
            case 3:
                this.move = this.make_expert_move;
                break;
            default:
                this.move = this.make_random_move;
                break;
        }
    }

    play()
    {
        setTimeout(() => {
            this.game.make_move(this.move(), this.symbol);
        }, 2000)
    }

    make_random_move()
    {
        let valid_move = false;

        this.game.board.forEach((cell, i) => {
            if(cell.textContent == "")
            {
                valid_move = i;
                return;
            }
        })
        return valid_move;
    }

    make_thoughty_move()
    {

    }

    make_expert_move()
    {

    }
}
