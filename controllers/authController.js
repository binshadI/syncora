const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require('../models/userModel');
const refreshTokenModel = require("../models/refreshTokenModel");
const jwt = require("jsonwebtoken");
const { generateaccestoken, generaterefreshtoken } = require("../utlis/jwt");

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
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;


    const user = await User.findOne({ email })


    if (!user) {
        res.status(401);
        throw new Error("no such email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401);
        throw new Error("no such email or password");
    }

    //jwt accesstoken
    const accessToken = generateaccestoken(user._id);


    const refreshToken = generaterefreshtoken(user.id);

    await refreshTokenModel.create({
        token:refreshToken,
        user : user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) //7 days
    })

    res.json({
        accessToken,
        refreshToken
    })


})


const checkToken = asyncHandler(async (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            msg: "refresh token required."
        });
    }

    jwt.verify(refreshToken,
        process.env.JWT_REFRESH_TOCKEN_SECRET,
        async (err, decodedUser) => {
            if (err) {
                return res.status(403).json({
                    msg: "invalid or expired token"
                })
            }

            const storedToken = await refreshTokenModel.findOne({
                token : refreshToken,
                isRevoked : false,
                expiresAt : {$gt:new Date()}
            })

            if(!storedToken){
                res.status(403).json({
                    msg : "refresh token not registerd"
                })
            }

            if(storedToken.user.toString() !== decodedUser.userid){
                return res.status(403).json({
                    msg : "token mismatch"
                })
            }


            storedToken.isRevoked = true;
            await storedToken.save();

            const newaccestoken = generateaccestoken(decodedUser.userid);
            const newrefreshtoken = generateaccestoken(decodedUser.userid);

            await refreshTokenModel.create({
                token : newrefreshtoken,
                user : decodedUser.userid,
                expiresAt : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            res.json({
                newaccessToken : newaccestoken,
                newrefreshtoken : newrefreshtoken
            })


        })


});

module.exports = {
    register,
    login,
    checkToken
}