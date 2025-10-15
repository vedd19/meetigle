import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io';
import { UserManager } from './managers/UserManager.js';



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173'],
    }
});


const userManager = new UserManager();


io.on('connection', (socket) => {

    console.log('a user is connected', socket.id);
    //anytime a connection happens we have a user.
    //after a user connects.....
    userManager.addUser({ name: 'randomname', socket });
    // console.log(socket)



    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        console.log('remaining clients: ', io.engine.clientsCount);
        userManager.removeUser(socket.id)
    })

});


httpServer.listen(4000, () => {
    console.log('Server running on port 4000');
});


