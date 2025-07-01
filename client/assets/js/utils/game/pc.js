import { Game } from "./game.js";

export class PC
{
    constructor(symbol, game = new Game())
    {
        this.symbol = symbol;
        this.game = game;
    }

    make_random_move()
    {
        let available_moves = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.game.board[i][j] === '') {
                    available_moves.push({ row: i, col: j });
                }
            }
        }

        if (available_moves.length > 0) {
            const random_move = available_moves[Math.floor(Math.random() * available_moves.length)];
            this.game.make_move(random_move.row, random_move.col);
        }
    }
}