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

        this.update_status("Your turn", "your-turn")
    }

    update_status(message, variant = "default") {
        const panel = document.getElementById("status-panel");
        const text = document.getElementById("status-message");
        const icon = document.getElementById("status-icon");

        text.textContent = message;

        panel.className = "w-full max-w-md mx-auto mt-4 px-4 py-3 rounded-xl shadow text-center text-lg font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300";
        icon.classList.add("hidden");

        switch (variant) {
            case "waiting":
            panel.classList.add("bg-gray-600");
            icon.classList.remove("hidden");
            break;
            case "your-turn":
            panel.classList.add("bg-blue-600");
            break;
            case "opponent-turn":
            panel.classList.add("bg-indigo-600");
            break;
            case "win":
            panel.classList.add("bg-green-600");
            break;
            case "lose":
            panel.classList.add("bg-red-600");
            break;
            case "draw":
            panel.classList.add("bg-yellow-500", "text-black");
            break;
            default:
            panel.classList.add("bg-gray-600");
        }
    }


    create_board()
    {
        console.log("Creating game board...");

        globals.game_board.innerHTML = ""

        const game_status = document.createElement('div')
        game_status.id = 'game_status'
        game_status.classList.add('w-full')
        game_status.innerHTML = `<div id="status-panel" class="w-full max-w-md mx-auto mt-4 px-4 py-3 rounded-xl shadow text-center text-lg font-semibold text-white bg-gray-600 flex items-center justify-center gap-2 transition-all duration-300">
        <svg id="status-icon" class="w-5 h-5 animate-spin hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span id="status-message">Aguardando jogadores...</span>
        </div>`
        globals.game_board.appendChild(game_status)

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

        return cells
    }

    make_move(e)
    {
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
