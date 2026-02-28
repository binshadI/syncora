const express = require("express");
const app = express();
const connectDb = require("../config/db");
const auth = require("../routes/authRoutes");
const user = require("../routes/userRoutes");
const friendRequest = require("../routes/friendRequestRoute");

app.use(express.json());

//database connection
connectDb();


app.use('/auth',auth);

app.use('/',user);

app.use('/req',friendRequest);



module.exports = app