const express = require("express");
const router = express.Router()
const { profile } = require("../controllers/userController");
const {authenticateToken} = require("../middlewares/authToken");



router.get("/profile",authenticateToken,profile)


module.exports=router