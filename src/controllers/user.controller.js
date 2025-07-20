import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

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

export const update_profile_privacy = async (req, res) => {
    try {
        const {_public} = req.body
        const user = req.user

        user.prefs._public = _public

        user.save()

        res.status(200).json(user)
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

export const generate_2fa_secret = async (req, res) => {
    try {
        const user = req.user
        const secret = speakeasy.generateSecret({name: `Tic-Tac-Toe-${user.username}`, issuer: 'Tic-Tac-Toe'})

        qrcode.toDataURL(secret.otpauth_url, (err, qr) => {
            if(err) return res.status(500).json({message: 'Internal Server Error'})

            res.status(200).json({secret: secret.base32, qr})
        })
    } catch (error) {
        console.log('Generate 2fa secret cntroller error: ', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}

export const verify_2fa_code = async (req, res) => {
    try {
        const { secret, code } = req.body

        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: code
        })

        if(!verified) return res.status(400).json({message: 'Invalid 2FA code, please try again!'})

        req.user.prefs._2fa = true
        req.user.prefs._2fa_secret = secret
        req.user.save()

        res.status(200).json(req.user)
    } catch (error) {
        console.log('Verify 2fa code cntroller error: ', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}

export const disable_2fa = async (req, res) => {
    try {
        req.user.prefs._2fa = false
        req.user.prefs._2fa_secret = ''
        req.user.save()

        res.status(200).json(req.user)
    } catch (error) {
        console.log('Disable 2fa cntroller error: ', error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}