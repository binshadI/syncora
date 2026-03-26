const callRooms = {};

module.exports = function callhandler(io, socket, onlineUsers) {

    // ── Invite ───────────────────────────────────────────────────────
    socket.on('call:invite', ({ friendId, callRoomId, callType }) => {
        const targetSocketId = onlineUsers[friendId];

        if (!targetSocketId) {
            return socket.emit('call:error', { message: 'User is not online' });
        }

        const callerName = socket.data.username || 'Unknown';

        console.log(`caller name recived:${callerName}`);
        
        console.log(`[call:invite] onlineUsers:`, JSON.stringify(onlineUsers)); // ← all online users
        console.log(`[call:invite] friendId=${friendId} → targetSocket=${targetSocketId}`);

        console.log(`[call:invite] from=${socket.id} → friendId=${friendId} type=${callType}`);

        io.to(targetSocketId).emit('call:incoming', {
            from: socket.id,
            callRoomId,
            callType,
            callerName,
        });
    });

    // ── Join ─────────────────────────────────────────────────────────
    socket.on('call:join', ({ callRoomId, callType }) => {
        if (!callRoomId) {
            return socket.emit('call:error', { message: 'callRoomId is required' });
        }

        if (!callRooms[callRoomId]) callRooms[callRoomId] = [];

        if (callRooms[callRoomId].length >= 2) {
            return socket.emit('call:busy');
        }

        callRooms[callRoomId].push(socket.id);
        socket.join(callRoomId);
        socket.data.callRoomId = callRoomId;

        const others = callRooms[callRoomId].filter(id => id !== socket.id);

        socket.emit('call:joined', { callRoomId, callType, peers: others });

        socket.to(callRoomId).emit('call:peer_joined', {
            peerId: socket.id,
            callType,
        });

        console.log(`[call:join] ${socket.id} → room="${callRoomId}" (${callRooms[callRoomId].length}/2)`);
    });

    // ── Offer ────────────────────────────────────────────────────────
    socket.on('call:offer', ({ target, sdp, callType }) => {
        console.log(`[call:offer] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:offer', { from: socket.id, sdp, callType });
    });

    // ── Answer ───────────────────────────────────────────────────────
    socket.on('call:answer', ({ target, sdp }) => {
        console.log(`[call:answer] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:answer', { from: socket.id, sdp });
    });

    // ── ICE Candidate ────────────────────────────────────────────────
    socket.on('call:ice_candidate', ({ target, candidate }) => {
        io.to(target).emit('call:ice_candidate', { from: socket.id, candidate });
    });

    // ── Hang Up ──────────────────────────────────────────────────────
    socket.on('call:hang_up', ({ target }) => {
        console.log(`[call:hang_up] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:peer_hung_up');
        _leaveCallRoom(socket);
    });

    // ── Reject ───────────────────────────────────────────────────────
    socket.on('call:reject', ({ target }) => {
        console.log(`[call:reject] from=${socket.id} → target=${target}`);
        io.to(target).emit('call:rejected');
        _leaveCallRoom(socket);
    });

    // ── Helper ───────────────────────────────────────────────────────
    function _leaveCallRoom(socket) {
        const callRoomId = socket.data.callRoomId;
        if (!callRoomId || !callRooms[callRoomId]) return;

        callRooms[callRoomId] = callRooms[callRoomId].filter(id => id !== socket.id);
        socket.to(callRoomId).emit('call:peer_left');

        if (callRooms[callRoomId].length === 0) {
            delete callRooms[callRoomId];
            console.log(`[call] room "${callRoomId}" deleted`);
        }

        delete socket.data.callRoomId;
    }

    // ── Disconnect (called from index.js, no duplicate here) ─────────
    socket.on('disconnect', () => {
        _leaveCallRoom(socket);
    });
};