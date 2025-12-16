const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateaccestoken(userid) {
    return jwt.sign(
        { userid }
        , process.env.JWT_ACCESS_SECRET,
        { expiresIn: "5h" });

}


function generaterefreshtoken(userid){
    return jwt.sign(
        {userid},
        process.env.JWT_REFRESH_TOCKEN_SECRET,
    )
}

module.exports = {
    generateaccestoken,
    generaterefreshtoken
}