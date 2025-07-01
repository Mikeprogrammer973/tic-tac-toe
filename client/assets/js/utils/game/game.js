import { globals } from "../globals.js"
 
export class Game
{
    constructor(board_size = 3)
    {
        this.board_size = board_size
        this.board = this.create_board()
        this.turn = 'X'
        this.game_over = false
        this.winner = null
    }

    create_board()
    {
        console.log("Creating game board...");

        globals.game_board.innerHTML = ""
        const board = document.createElement('div')
        board.classList.add('board')
        board.style.setProperty('--size', this.board_size)
        globals.game_board.appendChild(board)


        let cells = []
        for(let i = 0; i < Math.pow(this.board_size, 2); i++)
        {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.dataset.index = i
            cell.addEventListener('click', (e) => this.make_move(e))
            board.appendChild(cell)
            cells.push(cell)
        }

        console.log("Game board created!");
        return cells
    }

    make_move(e)
    {
        console.log("Making move...");

        if (this.game_over) return false;
        const index = e.target.dataset.index

        if (this.board[index].textContent !== "") return false;

        this.board[index].textContent = this.turn

        this.turn = this.turn === 'X' ? 'O' : 'X'

        return true
    }

    check_for_winner()
    {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2] && this.board[i][0] !== '') {
                this.winner = this.board[i][0];
                this.game_over = true;
                return;
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i] && this.board[0][i] !== '') {
                this.winner = this.board[0][i];
                this.game_over = true;
                return;
            }
        }

        // Check diagonals
        if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2] && this.board[0][0] !== '') {
            this.winner = this.board[0][0];
            this.game_over = true;
            return;
        }
        if (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0] && this.board[0][2] !== '') {
            this.winner = this.board[0][2];
            this.game_over = true;
            return;
        }
    }

    reset_game()
    {
        this.board = this.create_board();
        this.turn = 'X';
        this.game_over = false;
        this.winner = null;
    }
}
