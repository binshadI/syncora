const express = require("express");
const app = express();
const connectDb = require("../config/db");
const auth = require("../routes/authRoutes");
const user = require("../routes/userRoutes");

app.use(express.json());
//database connection
connectDb();


app.use('/auth',auth);

app.use('/',user);



module.exports = app