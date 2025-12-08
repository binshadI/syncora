const express = require("express");
const app = express();
const connectDb = require("../config/db");
const auth = require("../routes/authRoutes");


app.use(express.json());
//database connection
connectDb();


app.use('/auth',auth);



module.exports = app