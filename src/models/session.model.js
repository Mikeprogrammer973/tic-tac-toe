import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jwt: { type: String },
  userAgent: { type: String },
  ipAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  lastSeenAt: { type: Date, default: Date.now },
  isRevoked: { type: Boolean, default: false }
})

const Session = mongoose.model('Session', sessionSchema)

export default Session
