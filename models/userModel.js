const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "fill the username"]
    },
    email: {
        type: String,
        required: [true, "fill the email"],
        unique: [true, "This email is already taken"]
    },
    password: {
        type: String,
        require: [true, "fill the password"]
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    }
}, { timestamp: true });


module.exports = mongoose.model("User",userSchema);
