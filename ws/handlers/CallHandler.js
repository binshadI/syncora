const callRooms = {};

module.exports = function callhandler(io, socket, onlineUsers) {


    // invite section ..
    socket.on('call:invite', ({ friendId, callRoomId, callType, callerName }) => {
        const targetSocketId = onlineUsers[friendId];

        if (!targetSocketId) {
            return socket.emit('call:error', { message: "user is not online" });
        }

        console.log(`[call:invite] from=${socket.id} → friendId=${friendId} type=${callType}`);

        io.to(targetSocketId).emit('call:incoming', {
            from: socket.id,
            callRoomId,
            callType,
            callerName
        });
    });

    socket.on('call:join', ({ callRoomId, callType }) => {
        if (!callRoomId) {
            return socket.emit('call:error', { message: 'callRoomId is required' });
        }
        if (!callRooms[callRoomId]) callRooms[callRoomId] = []; // initialize first
        if (callRooms[callRoomId].length >= 2) {                // then check
            return socket.emit('call:busy');
        }

        callRooms[callRoomId].push(socket.id);
        socket.join(callRoomId);
        socket.data.callRoomId = callRoomId;

        const others = callRooms[callRoomId].filter(id => id !== socket.id)

        socket.emit('call:joined', {
            callRoomId,
            callType,
            peers: others
        });

        socket.to(callRoomId).emit('call:peer_joined', {
            peerId: socket.id,
            callType,
        });

        console.log(`[call:join] ${socket.id} → room="${callRoomId}" (${callRooms[callRoomId].length}/2)`);
    });

    //offer creates sdp offer and send to the receiver.

    socket.on('call:offer', ({ target, sdp, callType }) => {
        console.log(`[call:offer] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:offer', {
            from: socket.id,
            sdp,
            callType
        });
    });

    socket.on('call:answer', ({ target, sdp }) => {
        console.log(`[call:answer] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:answer', {
            from: socket.id,
            sdp
        });
    });

    //ice candidate

    socket.on('call:ice_candidate', ({ target, candidate }) => {
        io.to(target).emit('call:ice_candidate', {
            from: socket.id,
            candidate
        });
    });


    //hang up

    socket.on('call:hang_up', ({ target }) => {
        console.log(`[call:hang_up] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:peer_hung_up');
        _leaveCallRoom(socket);
    });

    //reject ..
    socket.on('call:reject', ({ target }) => {
        console.log(`[call:reject] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:rejected');
        _leaveCallRoom(socket);
    });

    socket.on('disconnect', () => {
        _leaveCallRoom(socket);
    });

    function _leaveCallRoom(socket) {
        const callRoomId = socket.data.callRoomId;
        if (!callRoomId || !callRooms[callRoomId]) return;

        callRooms[callRoomId] = callRooms[callRoomId].filter(id => id !== socket.id);

        // Tell the other peer their partner left
        socket.to(callRoomId).emit('call:peer_left');

        // Delete empty room
        if (callRooms[callRoomId].length === 0) {
            delete callRooms[callRoomId];
            console.log(`[call] room "${callRoomId}" deleted`);
        }

        delete socket.data.callRoomId;
    }


}