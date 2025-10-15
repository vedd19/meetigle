import { useState } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from "socket.io-client";

const URL = 'http://localhost:4000';

export default function Room() {

    const [searchParams, setSearchParams] = useSearchParams();
    const name = searchParams.get('name');
    const [socket, setSocket] = useState(null);
    const [lobby, setLobby] = useState(true);


    useEffect(() => {

        const socket = io(URL)

        socket.on('send-offer', ({ roomId }) => {
            setLobby(false);
            alert('send offer please...');
            socket.emit('offer', {
                sdp: '',
                roomId,
            })
        })

        socket.on('offer', ({ roomId, offer }) => {
            setLobby(false);
            alert("send answer please");
            // socket.emit('answer', { roomId, sdp: '' })

        })

        socket.on('answer', ({ roomId, answer }) => {
            setLobby(false);
            alert('connection done');
        })

        socket.on('lobby', () => {
            setLobby(true);
        })

        setSocket(socket);

    }, [name]);

    if (lobby) {
        return (
            <div>
                waiting for someone to connect
            </div>
        )
    }



    return (
        <div>

            hello {name}

            <video width={400} height={400} src=""></video>
            <video width={400} height={400} src=""></video>

        </div>
    )
}