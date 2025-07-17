import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"

export const update_profile = async (req, res) => {
    try {
        const {full_name, username, email} = req.body
        const user = req.user

        const game_log = {
            mode,
            vs,
            date: {
                init,
                end
            },
            result
        }

        switch(result)
        {
            case 1:
                let bonus = 2.007

                if(mode == "online") bonus += 7.07
                if(mode == "local") bonus += 5.07
                if(mode == "pc" && vs == "Bot 3") bonus += 3.07

                user.stats.xp += Math.floor(((result * 100 * (user.stats.level + 1)) / 7) * bonus)
                break
            case 0:
                user.stats.xp += 7 * (user.stats.level + 1)
                break
            default:
                user.stats.xp -= 7 * (user.stats.level + 1)
        }

        const lv_up = (Math.floor(user.stats.xp / (1000 * (user.stats.level + 1)))) - user.stats.level
        user.stats.level += lv_up > 0 ? lv_up : 0

        user.games.push(game_log)

        user.save()

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