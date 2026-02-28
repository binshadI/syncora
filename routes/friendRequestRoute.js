const express = require('express');
const router = express.Router();

const {loignValidation} = require("../middlewares/validation");
const {friendRequest,inbox,status,contact} = require('../controllers/friendRequestController');
const {authenticateToken} = require("../middlewares/authToken");




router.post('/friendRequest',authenticateToken,friendRequest);
router.get('/inbox',authenticateToken,inbox);
router.put('/status/:id',authenticateToken,status);
router.get("/contact",authenticateToken,contact);

module.exports = router