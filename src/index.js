import express from 'express'
import authRoutes from './routes/auth.route.js'
import gameRoutes from './routes/game.route.js'
import userRoutes from './routes/user.route.js'
import dotenv from 'dotenv'
import { connect as connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import  { socket_authMiddleware } from './middlewares/auth.middleware.js'


dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server)

const PORT = process.env.PORT

app.use(express.static('client'))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/game", gameRoutes)
app.use("/api/user", userRoutes)

let awaiting_player = null
const rematchVotes = new Map()

// Socket.io

io.use(socket_authMiddleware)

io.on('connection', (socket) => {
    console.log('Jogador conectado:',  socket.id);

    if(awaiting_player)
    {
        const roomId = socket.id + "#" + awaiting_player.id
        socket.join(roomId)
        awaiting_player.join(roomId)

        // Start the game

        const name = socket.user.username
        const opponent_name = awaiting_player.user.username

        socket.emit("startGame", { roomId, symbol: "O",  name, opponent_name });
        awaiting_player.emit("startGame", { roomId, symbol: "X",  name: opponent_name, opponent_name: name });

        // Reset the queue
        awaiting_player = null
    } else {
        awaiting_player = socket
        socket.emit("waiting");
    }

    socket.on("makeMove", ({ roomId, index, symbol }) => {
        socket.to(roomId).emit("opponentMove", { index, symbol });
    });

    socket.on("gameOver", ({ roomId, winner }) => {
        socket.to(roomId).emit("gameOver", { winner });
    });

    socket.on("rematchRequest", ({ roomId }) => {
        if (!rematchVotes.has(roomId)) {
            rematchVotes.set(roomId, new Set());
        }

        const votes = rematchVotes.get(roomId);
        votes.add(socket.id);

        if (votes.size === 2) {
            rematchVotes.delete(roomId);

            // Determinar símbolos aleatórios
            const sockets = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            const [id1, id2] = sockets;
            const symbols = Math.random() > 0.5 ? ["X", "O"] : ["O", "X"];
            const name = socket.user.username
            const opponent_name = io.sockets.sockets.get(id2).user.username === name ? io.sockets.sockets.get(id1).user.username : io.sockets.sockets.get(id2).user.username

            io.to(id1).emit("rematchAccepted", { roomId, symbol: symbols[0], name, opponent_name });
            io.to(id2).emit("rematchAccepted", { roomId, symbol: symbols[1],  name: opponent_name, opponent_name: name });
        } else {
            socket.to(roomId).emit("rematchRequest")
        }
    
    });

    socket.on("disconnecting", () => {
        const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
        rooms.forEach(roomId => {
            socket.to(roomId).emit("opponentLeft");
        });
    });

    socket.on("disconnect", () => {
        console.log("Jogador desconectado:", socket.id);
        if (awaiting_player === socket) {
            awaiting_player = null;
        }
    });
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
    connectDB()
})
