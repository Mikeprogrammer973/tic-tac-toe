import { Game } from "./game.js";

export class PC
{
    constructor(symbol, game, level = 2)
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
        const valid_moves = [];
        let valid_move = null;

        this.game.board.forEach((cell, i) => {
            if(cell.textContent == "")
            {
                valid_moves.push(i);
            }
        })

        if(valid_moves.length > 0)
        {
            valid_move = valid_moves[Math.floor(Math.random() * valid_moves.length)];
        }

        return valid_move;
    }

    any_winning_move()
    {
        for (let i = 0; i < Game.winning_combinations.length; i++) {
            const [a, b, c] = Game.winning_combinations[i];
            if (this.game.board[a].textContent === this.game.board[b].textContent && this.game.board[a].textContent === this.symbol && this.game.board[c].textContent === '') {
                return this.game.board[c].dataset.index;
            }
            if (this.game.board[a].textContent === this.game.board[c].textContent && this.game.board[a].textContent === this.symbol && this.game.board[b].textContent === '') {
                return this.game.board[b].dataset.index;
            }
            if (this.game.board[b].textContent === this.game.board[c].textContent && this.game.board[b].textContent === this.symbol && this.game.board[a].textContent === '') {
                return this.game.board[a].dataset.index;
            }
        }

        return null;
    }

    any_blocking_move()
    {
        const  opponent_symbol = this.symbol === 'X' ? 'O' : 'X';

        for (let i = 0; i < Game.winning_combinations.length; i++) {
            const [a, b, c] = Game.winning_combinations[i];
            if (this.game.board[a].textContent === this.game.board[b].textContent && this.game.board[a].textContent === opponent_symbol && this.game.board[c].textContent === '') {
                return this.game.board[c].dataset.index;
            }
            if (this.game.board[a].textContent === this.game.board[c].textContent && this.game.board[a].textContent === opponent_symbol && this.game.board[b].textContent === '') {
                return this.game.board[b].dataset.index;
            }
            if (this.game.board[b].textContent === this.game.board[c].textContent && this.game.board[b].textContent === opponent_symbol && this.game.board[a].textContent === '') {
                return this.game.board[a].dataset.index;
            }
        }

        return null;
    }

    any_strategic_move()
    {
        const winning_strategies = [
            
        ]
    }


    make_thoughty_move()
    {
        const winning_move = this.any_winning_move();
        if(winning_move)
        {
            console.log("Winning move found!",  winning_move);
            return winning_move;
        }

        const blocking_move = this.any_blocking_move();
        if(blocking_move)
        {
            console.log("Blocking move found!",  blocking_move);
            return blocking_move;
        }

        return this.make_random_move();
    }

    make_expert_move()
    {

    }
}
