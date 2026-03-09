const friendRequestModel = require("../models/friendRequestModel");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const friendRequest = asyncHandler(async (req, res) => {

    const user = req.user.userid;

    const finduser = await User.findOne({_id : user});


    console.log("req recived..")

    const { searchEmail } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg,
        });
    }


    const serachuser = await User.findOne({ email: searchEmail });

    if(searchEmail === finduser.email){
        return res.status(404).json({
            message:"bro its you.."
        });
    }

    if (!serachuser) {
        return res.status(404).json({
            message: "No such user found",
        });
    }

    const sender = req.user.userid



    //add the frnd-req to the model 

    const frnd_req = await friendRequestModel.create({
        from: sender,
        to: serachuser
    },);

    return res.status(200).json({
        message: "friend request sent successfully"
    });

});




const inbox = asyncHandler(async (req, res) => {

    const currentuserid = req.user.userid;

    const request = await friendRequestModel.find({
        to: currentuserid,
        status: "pending",
    })
        .populate("from", "email")
        .select("-to -status -__v");

    return res.status(200).json({
        success: true,
        count: request.length,
        request
    });
});


const status = asyncHandler(async (req, res) => {


    const requsetid = req.params.id;

    const findid = await friendRequestModel.findById({ _id: requsetid });//req id 


    const { status } = req.body;


    if (!findid) {
        return res.status(422).json({
            message: "no such id found.."
        });
    }

    const sender = findid.from;//binshad
    const receiver = findid.to;//amal



    if (status === " ") {
        return res.status(400).json({
            message: "status can't be null"
        })
    }

    const user = await User.findById(receiver); //amal

    if (status === 'accepted') {

        const alreadyfriend = await User.findOne({
            _id : receiver,
            contact : sender
        }) || await User.findOne({
            _id : sender,
            contact : receiver
        });

        if (alreadyfriend){
            return res.status(400).json({
                message : "this user is already in your contact"
            })
        }

        await User.findByIdAndUpdate(
            receiver,
            { $addToSet: { contact: sender } }
        );

        await User.findByIdAndUpdate(
            sender,
            { $addToSet: { contact: receiver } }
        )

        await friendRequestModel.findByIdAndUpdate(
            requsetid,
            { status: "accepted" }
        );

        return res.status(200).json({
            message:"added to your contact"
        })

    }
    else if (status === "declined") {

        await friendRequestModel.findByIdAndUpdate(
            requsetid,
            { status: "declined" }
        );

        return res.status(400).json({
            message: "friendRequest rejected"
        })
    } else {
        return res.status(400).json({
            message: "invalid status"
        });
    }


});

const contact = asyncHandler(async (req,res)=>{
    const userid = req.user.userid;

   const user =  await User.findById(userid);

   if(!user){
    return res.status(400).json({
        message:"user not found"
    });
   }

   return res.status(200).json(
    {
        contact : user.contact
    }
   );

});



module.exports = {
    friendRequest,
    inbox,
    status,
    contact
}