const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const User = require('../models/userModel');

const contactdisplay = asyncHandler(async (req, res) => {

    const userid = req.user.userid;

    const user = await User.findById(userid)
        .populate("contact","username -_id")
        .select("contact");


    if (!user) {
        return res.status(400).json({
            message: "user not found"
        });
    }

    res.status(200).json({
        contact : user.contact
    })
});



module.exports = {
    contactdisplay
}