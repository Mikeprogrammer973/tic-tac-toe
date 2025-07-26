import mongoose from 'mongoose'

const gameShema = new mongoose.Shema({
  userId: { type: mongoose.Type.ObjectId, ref: 'User', required: true }
})
