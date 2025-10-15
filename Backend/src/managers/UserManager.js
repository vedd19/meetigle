import { RoomManager } from "./RoomManager";

export class UserManager {
    #users;
    #queue; //for storing the users
    #roomManager
    constructor() {
        this.#users = [];
        this.#roomManager = new RoomManager()

    }

    addUser({ name, socket }) {

        this.#users.push({
            socket, name
        })

        //anythine a user joins they will be part of the queue
        this.#queue.push(socket.id);


        this.clearQueue()// this will keep matching the users present in the queue until it gets empty

        this.initHandlers(socket);

    }

    removeUser(socketId) {

        this.#users = this.#users.filter(user => user.socket.id !== socketId);
        this.#queue = this.#queue.filter(x => x !== socketId);
        const roomId = this.generate();

    }

    clearQueue() {
        if (this.#queue.length < 2) {
            return;
        }

        const user1 = this.#users.find(user => user.socket.id === this.#queue.pop());
        const user2 = this.#users.find(user => user.socket.id === this.#queue.pop());

        //now we have to maintain that these are the two users that are the part of this room.

        if (!user1 || !user2) {
            return;
        }
        const room = this.#roomManager.createRoom(user1, user2)
    }

    initHandlers(socket) {
        socket.on('offer', ({ sdp, roomId }) => {
            this.#roomManager.onOffer(roomId, sdp)
        });

        socket.on('answer', ({ sdp, roomId }) => {
            this.#roomManager.onAnswer(roomId, sdp);
        })


    }


}