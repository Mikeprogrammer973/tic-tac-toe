import { globals } from "../globals.js"
 
export class Game
{
    static winning_combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    constructor(board_size = 3)
    {
        this.board_size = board_size
        this.board = null
        this.players = []
        this.turn = null
        this.game_over = false
        this.winner = null
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
            cell.addEventListener('click', (e) => {
                if(!this.game_over && !this.turn.isBot)
                {
                    this.make_move(e.target.dataset.index, this.turn.symbol)
                }
            })
            board.appendChild(cell)
            cells.push(cell)
        }

        const retry_btn = document.createElement('button')
        retry_btn.id = 'retry-btn'
        retry_btn.classList.add('retry-btn', 'hidden')
        retry_btn.textContent = "Play again"
        retry_btn.addEventListener('click', () => {
            this.reset_game()
        })
        globals.game_board.appendChild(retry_btn)

        this.update_status("Your turn", "your-turn")

        return cells
    }

    make_move(move, symbol)
    {
        if(this.game_over)
        {
            console.log("Game already over!");
            return;
        }
        
        if(this.board[move].textContent != "")
        {
            console.log("Cell already taken!");
            return;
        }

        this.board[move].textContent = symbol

        this.check_for_winner()

        if(!this.game_over)
        {
            this.turn = this.turn == this.players[0] ? this.players[1] : this.players[0]

            const status = {
                message: !this.turn.mySelf ? "Opponent's turn" : "Your turn",
                variant: !this.turn.mySelf  ? "opponent-turn" : "your-turn"
            }
            this.update_status(status.message, status.variant)

            if(this.turn.isBot)
            {
                this.turn.play()
            }
        } else {
            const status = {message: "Game over", variant: "default"}

            if(this.winner == 'draw')
            {
                status.message = "It's a draw!"
                status.variant = "draw"
            } else if(this.winner.mySelf)
            {
                status.message = "You won!"
                status.variant = "win"
            } else {
                status.message = "You lost!"
                status.variant = "lose"
            }

            this.update_status(status.message, status.variant)

            document.getElementById('retry-btn').classList.remove('hidden')
        }
    }

    check_for_winner()
    {
        for (let i = 0; i < Game.winning_combinations.length; i++) {
            const [a, b, c] = Game.winning_combinations[i];
            if (this.board[a].textContent === this.board[b].textContent && this.board[a].textContent === this.board[c].textContent && this.board[a].textContent !== '') {
                this.game_over = true;
                this.winner = this.turn;

                this.board[a].classList.add('win');
                this.board[b].classList.add('win');
                this.board[c].classList.add('win');

                return;
            }
        }

        // Draw
        if (this.board.every(cell => cell.textContent !== '')) {
            this.game_over = true;
            this.winner = 'draw';
            return;
        }

        this.winner = null;
        this.game_over = false;
    }

    reset_game()
    {
        this.board = this.create_board();
        this.turn = this.players[Math.floor(Math.random() * this.players.length)];
        this.game_over = false;
        this.winner = null;

        const status = {
            message: !this.turn.mySelf ? "Opponent's turn" : "Your turn",
            variant: !this.turn.mySelf  ? "opponent-turn" : "your-turn"
        }
        this.update_status(status.message, status.variant)

        if(this.turn.isBot)
        {
            this.turn.play()
        }
    }
}
