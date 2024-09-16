const { v4 : uuidv4 } = require('uuid');

const rooms = {};


function roomHandler(io, socket) {
    
    socket.on('create-room', () => {
        const roomId = uuidv4();
        console.log('__________user created the room :: ', roomId);
        rooms[roomId] = [];
        socket.emit('room-created', { roomId });
    });


    socket.on('join-room', ({ roomId, peerId }) => {

        if(!peerId) {
            console.log('____________user tried to join the room with no peerId');
            return;
        }

        if(!roomId) {
            console.log('____________user tried to join the room with no roomId');
            return;
        }

        if(roomId && rooms[roomId] && peerId) {
            socket.join(roomId);
            rooms[roomId].push(peerId);
            console.log('____________user joined the room :: ', roomId, peerId);
            socket.emit('room-joined', { roomId, peerId });
        } 

        socket.on('disconnect', () => {
            console.log('__________user left the room :: ', roomId, peerId);
            if(rooms[roomId]) {
                rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
                socket.to(roomId).emit('user-disconnected', { peerId });    
            }
            console.log('____________current users in the room :: ', rooms[roomId]);
        });
    });

    socket.on('get-user-media-done', ({roomId, peerId}) => {
        console.log('______________get user media done :: ', roomId, peerId);
        socket.to(roomId).emit('user-joined', { peerId });    
    });

    socket.on('candidate', ({ roomId, candidate }) => {
        console.log("Candidate", candidate);
        socket.to(roomId).emit('candidate', candidate);
    });

    socket.on('offer', ({ roomId, offer }) => {
        console.log("Offer", offer);
        socket.to(roomId).emit('offer', offer);
    });

    socket.on('answer', ({ roomId, answer }) => {
        console.log("Answer", answer);
        socket.to(roomId).emit('answer', answer);
    });

    socket.on('start-screen-sharing', ({roomId , peerId, offer }) => {
        socket.to(roomId).emit('started-screen-sharing', peerId);        
        socket.to(roomId).emit('offer', offer);
    });
}

module.exports = { roomHandler }