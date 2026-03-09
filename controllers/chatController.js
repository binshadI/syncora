const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const friendRequestModel = require("../models/friendRequestModel");


const findroomId = asyncHandler(async (req, res) => {
    const userid = req.user.userid;
    const { friendId } = req.body;
    const friendRequest = await friendRequestModel.findOne({
        $or: [
            { from: userid, to: friendId },
            { from: friendId, to: userid }
        ]
    });

    if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
    }

    const roomId = friendRequest._id;



    return res.status(200).json({
        friendreqId: roomId
    })
});


module.exports = {
    findroomId,
}