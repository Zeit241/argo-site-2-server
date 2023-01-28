import JWT from "jsonwebtoken"
import * as dotenv from 'dotenv'
dotenv.config()

const CreateToken = (payload) => {
    return JWT.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
}

const VerifyToken = (token) =>{
    try {
        return JWT.verify(token, process.env.JWT_SECRET)
    }catch (e) {
        return false
    }

}
export {CreateToken, VerifyToken}