import { RoomManager } from "./RoomManager.js";

export class UserManager {
    #users;
    #queue; //for storing the users
    #roomManager
    constructor() {
        console.log("UserManager constructor called");
        this.#users = [];
        this.#roomManager = new RoomManager();
        this.#queue = [];

    }

    addUser({ name, socket }) {

        this.#users.push({
            socket, name
        })

        //anythine a user joins they will be part of the queue
        // console.log("Inside addUser → name:", name, "socket:", socket?.id)
        this.#queue.push(socket);

        socket.send('lobby')


        this.clearQueue()// this will keep matching the users present in the queue until it gets empty

        this.initHandlers(socket);

    }

    removeUser(socketId) {

        const user = this.#users.find(x => x.socket.id === socketId);

        // if (!user)

        this.#users = this.#users.filter(user => user.socket.id !== socketId);
        this.#queue = this.#queue.filter(x => x.id !== socketId);
        // const roomId = this.generate();

    }

    clearQueue() {
        console.log("inside clear queue")
        console.log(this.#queue.length);
        if (this.#queue.length < 2) {
            return;
        }

        const queueUser1Id = this.#queue.pop().id;
        const queueUser2Id = this.#queue.pop().id;

        const user1 = this.#users.find(user => user.socket.id === queueUser1Id);
        const user2 = this.#users.find(user => user.socket.id === queueUser2Id);
        // console.log("length >>", this.#users.length, "content", this.#users[0].socket.id)
        // console.log("queue >>", this.#queue);
        // console.log(user1)
        // console.log(user2)

        //now we have to maintain that these are the two users that are the part of this room.

        if (!user1 || !user2) {
            return;
        }
        console.log("create room")
        const room = this.#roomManager.createRoom(user1, user2);
        this.clearQueue()
    }

    initHandlers(socket) {
        socket.on('offer', ({ sdp, roomId }) => {
            console.log('inside getting offer in initHandler', roomId)
            this.#roomManager.onOffer(roomId, sdp, socket.id)
        });

        socket.on('answer', ({ sdp, roomId }) => {
            console.log('inside getting answer in initHandler', roomId)
            this.#roomManager.onAnswer(roomId, sdp, socket.id);
        })

        socket.on('add-ice-candidate', ({ candidate, roomId, type }) => {
            this.#roomManager.onIceCandidates(roomId, socket.id, candidate, type);
        });


    }


}