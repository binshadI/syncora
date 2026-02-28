const mongoose = require("mongoose");

const friendsRequestSchema = mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type : String,
        enum : ['pending','accepted','declined'],
        default : 'pending',
        required:true
    }
},{timestamp : true});

friendsRequestSchema.index({from:1,to:1},{unique : true});

module.exports = mongoose.model( 
    "friendRequest",friendsRequestSchema
);