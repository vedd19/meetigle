const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173'],
    }
});


const waitingUser = null;

io.on('connection', (socket) => {

    console.log('connected to the client', socket.id);

    const totatClient = io.engine.clientsCount
    console.log('total clients connected :', totatClient);

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        console.log('remaining clients: ', io.engine.clientsCount)
    })

});


httpServer.listen(4000, () => {
    console.log('Server running on port 4000');
});


