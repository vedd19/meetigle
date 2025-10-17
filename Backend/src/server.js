// import express from 'express'
// import { createServer } from 'http'
// import { Server } from 'socket.io';
// import { UserManager } from './managers/UserManager.js';
// import cors from 'cors'




// const app = express();

// app.use(cors({
//     origin: 'https://meetigle-frontend.onrender.com',
//     methods: ['GET', 'POST']
// }))

// const httpServer = createServer(app);
// const io = new Server(httpServer, { cors: { origin: 'https://meetigle-frontend.onrender.com', methods: ["GET", "POST"], credentials: true } });

// const port = process.env.PORT || 5000;

// const userManager = new UserManager();


// io.on('connection', (socket) => {

//     console.log('a user is connected', socket.id);
//     //anytime a connection happens we have a user.
//     //after a user connects.....
//     userManager.addUser({ name: 'randomname', socket });
//     // console.log(socket)



//     socket.on('disconnect', () => {
//         console.log(socket.id, 'disconnected');
//         console.log('remaining clients: ', io.engine.clientsCount);
//         userManager.removeUser(socket.id)
//     })

// });


// httpServer.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });





















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

