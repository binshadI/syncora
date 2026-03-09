const express = require("express");
const router = express.Router();

const {findroomId} = require("../controllers/chatController");
const {authenticateToken} = require("../middlewares/authToken");

router.get('/findroomId',authenticateToken,findroomId);

module.exports = router;