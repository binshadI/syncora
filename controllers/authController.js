const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require('../models/userModel');

//accout creation.....

const register = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("user already exist")
    }

    //hashed password......!!
    const hashedpassword = await bcrypt.hash(password, 10);


    //adding user to the db
    const user = await User.create({
        username,
        email,
        password: hashedpassword
    });
    if (user) {
        res.status(201).json({
            msg: "user created.."
        })
    } else {
        res.status(400)
        throw new Error("user data is not valid");
    }
});

//login.....
const login = asyncHandler (async(req,res)=>{
    
})

module.exports = {
    register,
    login
}