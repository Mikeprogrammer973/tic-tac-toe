import jwt from 'jsonwebtoken'

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