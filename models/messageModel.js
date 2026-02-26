const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message : {
        type : String,
        required:true
    },
    read : {
        type : Boolean,
        required : true
    }

}, { timestamp: true });

module.exports = mongoose.model("messages", messageSchema);