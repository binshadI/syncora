const express = require("express");
const app = express();
const connectDb = require("../config/db");
const auth = require("../routes/authRoutes");
const user = require("../routes/userRoutes");
const friendRequest = require("../routes/friendRequestRoute");
const contactdisplay = require("../routes/contactRoutes");
const chatRoutes = require("../routes/chatRoutes");

app.use(express.json());

//database connection
connectDb();


app.use('/auth',auth);

app.use('/',user);

app.use('/req',friendRequest);

app.use('/home',contactdisplay);

app.use('/chatroom',chatRoutes);



module.exports = app