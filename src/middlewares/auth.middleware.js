import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import Session from '../models/session.model.js'

const auth_guardMiddleware = async (req, res, next) => {
    try 
    {
        // check token
        const token = req.cookies.token
        if(!token) return res.status(401).json({ message: "Unauthorized - No token provided!" })

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const session = await Session.findOne({jwt: token, isRevoked: false})

        if(!decoded || !session) return res.status(401).json({ message: "Unauthorized - Invalid token!" })

        req.user = await User.findById(decoded.user_id).select("-password")

        if(!req.user) return res.status(401).json({ message: "Unauthorized - User not found!" })

        session.lastSeenAt = Date.now()
        session.save()

        // alright
        next()
    } catch (error) {
        console.log("Auth middleware error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export const socket_authMiddleware = async (socket, next) => {
    const token = socket.handshake.headers.cookie.split('token=')[1]
    if(!token) return next(new Error('Unauthorized - No token provided!'))

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) return next(new Error('Unauthorized - Invalid token!'))

        socket.user = await User.findById(decoded.user_id).select("-password")

        if(!socket.user) return next(new Error('Unauthorized - User not found!'))

        next()
    } catch (error) {
        console.log("Socket auth middleware error: ", error)
        next(new Error('Internal Server Error'))
    }
}

export default auth_guardMiddleware