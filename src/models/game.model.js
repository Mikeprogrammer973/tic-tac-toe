import mongoose from 'mongoose'

const gameShema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  mode: {
    type: String,
    required: true
  },
  vs: {
    type: String,
    required: true
  },
  date: {
    init: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  result: {
    type: Number,
    required: true
  }
})

const Game = mongoose.model('Game', gameShema)

export default Game
