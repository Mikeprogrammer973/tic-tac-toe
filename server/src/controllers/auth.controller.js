import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import { generate_token } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"



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
            // generate jwt token
            generate_token(new_user._id, res)
            new_user.save()

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

        // generate jwt token
        generate_token(user._id, res)

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


export const signout = (req, res) => {
    try {
        res.cookie("token", "", {maxAge:0})
        res.status(200).json({ message: "Signed out successful!" })
    } catch (error) {
        console.error("Signout controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}


export const update_profile = async (req, res) => {
    const {profilePic} = req.body
    const user = req.user
        
    try {
        // valid data?
        if(!profilePic) return res.status(400).json({ message: "Profile picture is required!" })

        // update user
        if(req.user.profilePic.name) await cloudinary.uploader.destroy(req.user.profilePic.name)
        const updated_user_profile = await cloudinary.uploader.upload(profilePic, {
            folder: "tech_games",
            public_id: `profile_pic_${user._id}`
        })

        const updated_user = await User.findByIdAndUpdate(user._id, {
            profilePic: {
                name: updated_user_profile.public_id,
                uri: updated_user_profile.secure_url
            }
        }, {new: true})

        res.status(200).json(updated_user)
        
    } catch (error) {
        console.error("Update profile controller error: ", error)
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
