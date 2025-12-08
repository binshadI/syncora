const { check } = require("express-validator");

const registerValidation = [
        check('username')
        .notEmpty()
        .withMessage("username can't be empty")
        .isLength({ min: 3 }).
        withMessage("username atleast contain 3 characters"),
        //email----->
        check('email')
        .notEmpty()
        .withMessage("email can't be empty")
        .isEmail()
        .withMessage("Enter a valid Email"),
        //password
        check('password')
        .notEmpty()
        .withMessage("password can't be empty")
        .isStrongPassword()
        .withMessage("password must contain capital-letter,numbers,and symbols")
    ]


module.exports = {registerValidation}