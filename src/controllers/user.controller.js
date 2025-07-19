import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"

export const update_profile = async (req, res) => {
    try {
        const {full_name, username, email} = req.body
        const user = req.user

        // check info
        if(!full_name || !username || !email) return res.status(400).json({ message: "All fields are required!" })

        // username already in use?
        if(user.username != username){
            await User.findOne({username: username})
            .then(user => {
                if(user) return res.status(400).json({ message: "Username already in use!" })
            })
        }

        // email already in use?
        if(user.email != email){
            await User.findOne({email: email})
            .then(user => {
                if(user) return res.status(400).json({ message: "Email already in use!" })
            })
        }

        // update user
        const updated_user = await User.findByIdAndUpdate(user._id, {
            fullName: full_name,
            username,
            email
        }, {new: true})

        res.status(200).json(updated_user)
    } catch (error) {
        console.error("Update profile controller error: ", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const update_profile_image = async (req, res) => {
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

export const get_global_ranking = async (req, res) => {
    try {
        res.status(200).json((await User.find()).filter(user => user.prefs._public))
    } catch (error) {
        console.log('Get global ranking cntroller error: ', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}