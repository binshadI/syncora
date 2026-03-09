const express = require('express');
const router = express.Router();
const {contactdisplay} = require("../controllers/contactsController.js");
const {authenticateToken} = require("../middlewares/authToken.js")


router.get('/contactdisplay',authenticateToken,contactdisplay);

module.exports = router;