const { Server } = require("socket.io");
const chatHandler = require("./handlers/ChatHandlers");
const CallHandler = require("./handlers/CallHandler");
const User = require('../models/userModel');


const onlineUsers = {};

let io;

function initialize(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log("user connected:", socket.id);

        socket.on('register', async(userId) => {
            onlineUsers[userId] = socket.id;
            socket.data.userId = userId;

            const user = await User.findById(userId).select('username');
            socket.data.username = user?.username ?? '';

            console.log(`[register] userId=${userId} username=${socket.data.username} → socketId=${socket.id}`);
        })

        //chatHandlers 
        chatHandler(io, socket);

        //callhandler
        CallHandler(io, socket, onlineUsers);

        //disconnect ======>
        socket.on('disconnect', () => {

            const userId = socket.data.userId;

            if (userId) {
                delete onlineUsers[userId];
                console.log(`[offline] userId=${userId}`);

            }
            console.log("user disconnected", socket.id);

        })

    })


}

module.exports = {
    initialize
}