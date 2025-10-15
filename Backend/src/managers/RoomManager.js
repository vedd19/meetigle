let GLOBAL_ROOM_ID = 1;
export class RoomManager {
    #rooms;
    constructor() {
        this.#rooms = new Map();

    }

    createRoom(user1, user2) {
        const roomId = this.generate();
        this.#rooms.set(roomId.toString(), { user1, user2 })

        user1.socket.emit('send-offer', {
            roomId,
        })

    }

    onOffer(roomId, sdp) {

        console.log(roomId, "rooms : ", this.#rooms);
        // console.log(this.#rooms.get(roomId.toString()));
        const user2 = this.#rooms.get(roomId.toString())?.user2
        user2?.socket.emit('offer', {
            roomId,
            sdp
        });
        // console.log(user2)

    }

    onAnswer(roomId, sdp) {
        const user1 = this.#rooms.get(roomId.toString())?.user1;
        user1?.socket.emit('answer', {
            roomId,
            sdp
        })
    }

    generate() {
        return GLOBAL_ROOM_ID++;
    }

}