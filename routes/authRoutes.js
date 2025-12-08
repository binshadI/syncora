const express = require("express");
const router = express.Router();
const { register,login } = require('../controllers/authController')
const { registerValidation } = require("../middlewares/validation")

router.get('/',(req,res)=>{
    res.send("router working");
})

router.post('/register',registerValidation,register);

router.post("/login",login);


module.exports = router