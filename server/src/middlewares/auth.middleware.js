import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const auth_guardMiddleware = async (req, res, next) => {
    try 
    {
        // check token
        const token = req.cookies.token
        if(!token) return res.status(401).json({ message: "Unauthorized - No token provided!" })

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token!" })

        req.user = await User.findById(decoded.user_id).select("-password")

        if(!req.user) return res.status(401).json({ message: "Unauthorized - User not found!" })

        // alright
        next()
    } catch (error) {
        console.log("Auth middleware error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default auth_guardMiddleware