const { Server } = require('socket.io');
const { roomHandler } = require('./room/roomService');

const io = new Server(8000, {
    cors: true
});

// let emailToSocketIdMap = new Map();
// let socketIdToEmailMap = new Map();
// emailToSocketIdMap.set(email, socket.id);
// socketIdToEmailMap.set(socket.id, email);

io.on('connection', (socket) => {
    console.log(`socket connected ${socket.id}`);

    roomHandler(io, socket);

    socket.on('disconnect', () => {
        console.log(`socket disconnected ${socket.id}`);
    })

});

