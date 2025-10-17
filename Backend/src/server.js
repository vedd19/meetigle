
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { UserManager } from './managers/UserManager.js';

const app = express();


const FRONTEND_URL = 'https://meetigle-frontend.onrender.com';


app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST']
}));


const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: FRONTEND_URL,
        methods: ['GET', 'POST']
    }
});


const userManager = new UserManager();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);


    userManager.addUser({ name: 'randomname', socket });


    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected');
        userManager.removeUser(socket.id);
    });


});


const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

