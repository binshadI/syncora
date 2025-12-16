const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        return res.status(401)
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decodedUser) => {
        if (err) {
            return res.status(403).json({
                msg: "invalid or expired token"
            })
        }
        req.user = decodedUser
        next()
    })
}


module.exports = { authenticateToken }