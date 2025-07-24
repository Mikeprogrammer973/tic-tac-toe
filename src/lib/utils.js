import jwt from 'jsonwebtoken'
import Session from '../models/session.model.js'

export function generate_token(user_id, res){
    const token = jwt.sign({user_id: user_id}, process.env.JWT_SECRET, {expiresIn: '7h'})

    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.ENV_MODE !== 'dev'
    })

    return token
}

export async function create_session(user, req, auth_token)
{
    const session = new Session({
        userId: user._id,
        jwt: auth_token,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    })

    await session.save()

    return session
}