const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN

class AuthServices {
    static generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );
    }
}

module.exports = AuthServices