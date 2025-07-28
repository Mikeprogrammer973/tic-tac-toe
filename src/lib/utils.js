import jwt from 'jsonwebtoken'
import Session from '../models/session.model.js'
import geoip from 'geoip-lite'

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
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const geo = geoip.lookup(ip.split(',')[0])

    const session = new Session({
        userId: user._id,
        jwt: auth_token,
        userAgent: req.headers['user-agent'],
        ipAddress: ip,
        location: {
            country: geo?.country,
            region: geo?.region,
            city: geo?.city
        },
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    })

    await session.save()

    return session
}