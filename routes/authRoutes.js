const express = require("express");
const router = express.Router();
const { register,login,verifyOtpcontroller,checkToken } = require('../controllers/authController')
const { registerValidation } = require("../middlewares/validation")
const { authenticateToken } = require("../middlewares/authToken");

router.get('/',(req,res)=>{
    res.send("router working");
})

router.post('/register',registerValidation,register);

router.post("/login",login);

router.post("/token",checkToken);

router.post("/verifyotp",verifyOtpcontroller)


module.exports = router