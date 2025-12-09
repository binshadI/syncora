const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler")

const profile = asyncHandler(async (req,res)=>{
    const user = await Users.findById(req.user.id).select("-password");

    if(!user){
        return res.status(404).json({msg : "user not found"})
    }
    res.json(user);
})



module.exports={profile}