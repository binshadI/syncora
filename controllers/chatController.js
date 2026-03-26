const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const friendRequestModel = require("../models/friendRequestModel");
const User = require('../models/userModel');
const Groq = require('groq-sdk');
require('dotenv').config();

const findroomId = asyncHandler(async (req, res) => {

    console.log("findroomid working");
    
    const userid = req.user.userid;
    const { friendId } = req.body;
    const friendRequest = await friendRequestModel.findOne({
        $or: [
            { from: userid, to: friendId },
            { from: friendId, to: userid }
        ]
    });

    if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found' });
    }

    const roomId = friendRequest._id;
    
  const [sender, friend] = await Promise.all([
    User.findById(userid).select('username'),
    User.findById(friendId).select('username'),
  ]);

  return res.status(200).json({
    friendreqId  : friendRequest._id,
    userId       : userid,
    friendId     : friendId,
    senderName   : sender?.username  ?? '',  // ← your name
    friendName   : friend?.username  ?? '',  // ← friend's name (bonus)
  });
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log('[Groq] key loaded:', process.env.GROQ_API_KEY ? '✅' : '❌ MISSING');

const generateText = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

  try {
    const completion = await groq.chat.completions.create({
      model   : 'llama-3.1-8b-instant',
      messages: [
        {
          role   : 'system',
          content: 'You are a helpful writing assistant. Generate clear professional text. Return only the generated text, no explanations.',
        },
        { role: 'user', content: prompt },
      ],
    });
    const text = completion.choices[0].message.content;
    console.log(`[generate] ✅ ${text.length} chars`);
    res.json({ text });
  } catch (err) {
    console.error('[generate] error:', err.message);
    res.status(500).json({ message: 'Generation failed' });
  }
};


module.exports = {
    findroomId,
    generateText,
}