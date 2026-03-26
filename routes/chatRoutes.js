const express = require("express");
const router = express.Router();

const {findroomId,generateText} = require("../controllers/chatController");
const {authenticateToken} = require("../middlewares/authToken");

router.post('/findroomId',authenticateToken,findroomId);
router.post('/generate', authenticateToken, generateText);

module.exports = router;