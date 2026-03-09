
module.exports = function chatHandler(io, socket) {

    socket.on('join_room', ({ roomId }) => {   
        if (!roomId) {
            return socket.emit("error",{message : "roomId required"});
        }
        socket.join(roomId);
        console.log(`${socket.id} joined in ${roomId}`)
    })

    socket.on("send_message", ({ roomId, msg,senderId}) => {

        if (!roomId || !msg || !senderId) {
            return socket.emit("error",{message:"roomId,message,senderId are required"});
        }

        io.to(roomId).emit('recive_msg', {
            socketId,
            msg
        })
    })


}