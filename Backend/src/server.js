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


// let waitingUser = null;

io.on('connection', (socket) => {

    console.log('a user is connected', socket.id);



    //anytime a connection happens we have a user.



    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        console.log('remaining clients: ', io.engine.clientsCount)
    })

});


httpServer.listen(4000, () => {
    console.log('Server running on port 4000');
});


