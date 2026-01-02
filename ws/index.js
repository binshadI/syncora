const { Server } = require("socket.io");
const chatHandler = require("./handlers/ChatHandlers");
let io;
function initialize(server) {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log("user connected:", socket.id);

        //chatHandlers 
        chatHandler(io,socket)

        //disconnect ======>
        socket.on('disconnect', () => {
            console.log("user disconnected", socket.id);

        })

    })


}

module.exports = {
    initialize
}