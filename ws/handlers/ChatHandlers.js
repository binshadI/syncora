module.exports = function chatHandler(io, socket) {

    socket.on('join_room', ({ roomId }) => {

        //debuging
        console.log("testing join_room")
        console.log(roomId);
        //end
        
        if (!roomId) {
            return socket.emit("roomId required");
        }
        socket.join(roomId);
        console.log(`${socket.id} joined in ${roomId}`)
    })

    socket.on("send_message", ({ roomId, msg }) => {

        if (!roomId || !msg) {
            return socket.emit("roomId and message are required");
        }

        io.to(roomId).emit('recive_msg', {
            from: socket.id,
            msg
        })
    })


}