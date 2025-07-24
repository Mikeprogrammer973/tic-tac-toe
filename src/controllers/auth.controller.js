import User from "../models/user.model.js"
import Session from "../models/session.model.js"
import bcryptjs from 'bcryptjs'
import { create_session, generate_token } from "../lib/utils.js"
import speakeasy from 'speakeasy'


export const signup = async (req, res) => {
    const {fullName, email, username, password} = req.body
    try {
        // valid data?
        if(!fullName || !email || !username || !password) return res.status(400).json({ message: "All fields are required!" })
        if(password.length < 10) return res.status(400).json({ message: "Password must be at least 10 characters!" }) 
        
        // existing user?
        let user = await User.findOne({email: email})
        
        if(user) return res.status(400).json({ message: "Email already in use!" }) 
        
        user = await User.findOne({username: username})
        
        if(user) return res.status(400).json({ message: "Username already in use!" }) 

        // hash password
        const hashed_pwd = bcryptjs.hashSync(password, bcryptjs.genSaltSync())

        // create new user
        const new_user = new User({
            fullName,
            email,
            username,
            password: hashed_pwd
        })

        // new user created?
        if(new_user)
        {
            // save user
            new_user.save()

            const token = generate_token(new_user._id, res)

            await create_session(new_user, req, token)

            res.status(201).json({
                _id: new_user._id,
                fullName: new_user.fullName,
                email: new_user.email,
                username: new_user.username,
                profilePic: new_user.profilePic,
                games: new_user.games,
                stats: new_user.stats
            })
        } else {
            res.status(400).json({ message: "Invalid user data!" }) 
        }
    } catch (error) {
        console.error("Signup controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const signin = async (req, res) => {
    const {identifier, password} = req.body
    try {
        // valid data?
        if(!identifier || !password) return res.status(400).json({ message: "All fields are required!" })
        
        // fetch user
        const user = await User.findOne({email: identifier}) || await User.findOne({username: identifier})
        
        // user exists?
        if(!user) return res.status(400).json({ message: "Invalid username/email or password!" }) 

        // check password
        if(!bcryptjs.compareSync(password, user.password)) return res.status(400).json({ message: "Invalid email or password!" })

        // 2fa enabled?
        if(user.prefs._2fa) return res.status(400).json({ requires2fa: true })

        // generate jwt token
        const token = generate_token(user._id, res)

        // create session
        await create_session(user, req, token)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            games: user.games,
            stats: user.stats
        })
    } catch (error) {
        console.error("Signin controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const signin_2fa = async (req, res) => {
    try {
        const {identifier, password, code} = req.body

        const user = await User.findOne({username: identifier}) || await User.findOne({email: identifier})

        if(!user) return res.status(400).json({ message: "Invalid username/email or password!" })

        if(!bcryptjs.compareSync(password, user.password)) return res.status(400).json({ message: "Invalid email or password!" })
        
        const verified = speakeasy.totp.verify({
            secret: user.prefs._2fa_secret,
            encoding: 'base32',
            token: code
        })

        if(!verified) return res.status(400).json({ message: "Invalid 2FA code, please try again!" })

        const token = generate_token(user._id, res)

        await create_session(user, req, token)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            username: user.username,
            profilePic: user.profilePic,
            games: user.games,
            stats: user.stats
        })

    } catch (error) {
        console.error("Signin controller error: ", error) 
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const signout = async (req, res) => {
    try {
        await Session.findOneAndUpdate({userId: req.user._id, jwt: req.cookies.token}, {isRevoked: true})
        res.cookie("token", "", {maxAge:0})
        res.status(200).json({ message: "Signed out successful!" })
    } catch (error) {
        console.error("Signout controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const list_sessions = async (req, res) => {
    try {
        const sessions = await Session.find({userId: req.user._id, isRevoked: false}).sort({createdAt: -1})
        res.status(200).json(sessions.map(session => ({
            id: session._id,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            createdAt: session.createdAt,
            lastSeenAt: session.lastSeenAt,
            current: session.jwt === req.cookies.token
        })))
    } catch (error) {
        console.error("List sessions controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const revoke_session = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)

        if(!session) return res.status(404).json({ message: "Session not found!" })
        
        session.isRevoked = true
        session.save()
    } catch (error) {
        console.error("Revoke session controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const check_auth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.error("Check auth controller error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
