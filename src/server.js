require('dotenv').config();

const app = require('./app');
const http = require("http");
const socketServer = require("../ws");

const PORT = process.env.PORT || 8080;

const server = new http.createServer(app)

socketServer.initialize(server);


server.listen(PORT,()=>{
    console.log(`server is running on prot ${PORT}`);
    
});