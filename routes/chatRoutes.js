const express = require("express");
const router = express.Router();

const {findroomId} = require("../controllers/chatController");
const {authenticateToken} = require("../middlewares/authToken");

router.post('/findroomId',authenticateToken,findroomId);

module.exports = router;