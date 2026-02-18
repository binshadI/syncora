const express = require("express");
const router = express.Router();
const { register,login,verifyOtpcontroller,checkToken } = require('../controllers/authController')
const { registerValidation,loignValidation } = require("../middlewares/validation")
const { authenticateToken } = require("../middlewares/authToken");

router.get('/',(req,res)=>{
    res.send("router working");
})

router.post('/register',registerValidation,register);

router.post("/login",loignValidation,login);

router.post("/token",checkToken);

router.post("/verifyotp",verifyOtpcontroller)


module.exports = router