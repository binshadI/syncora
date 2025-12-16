const mongoose = require("mongoose");


const refreshTokenSchema = mongoose.Schema({
    token : {
        type : String,
        require : true
    },
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    isRevoked:{
        type : Boolean,
        default : false
    },
    expiresAt:{
        type : Date,
        required : true
    }
},{timestamps : true})


module.exports = mongoose.model('refreshTokenModel',refreshTokenSchema);