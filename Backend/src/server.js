import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io';
import { UserManager } from './managers/UserManager.js';
import cors from 'cors'



const app = express();
app.use(cors())
const httpServer = createServer(app);
const io = new Server(httpServer);

// {
//     cors: {
//         origin: "*",
//         // [
//         // process.env.FRONTEND_ORIGIN,        // e.g. your production domain
//         // process.env.FRONTEND_PREVIEW_ORIGIN // optional: previews
//         // ].filter(Boolean),

//         methods: ["GET", "POST"],
//         // credentials: true
//     },
// }

const port = process.env.PORT || 5000;

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


httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


