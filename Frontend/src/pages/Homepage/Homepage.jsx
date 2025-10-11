import { useEffect } from "react"



import { io } from "socket.io-client";

const socket = io("http://localhost:4000");




export default function Homepage() {

    useEffect(() => {
        function establishConnection() {

            socket.on('connect', () => {
                console.log('connected to backend', socket.id);
            })

            socket.on("connect_error", (err) => {
                console.error("Connection error:", err.message);
            });

            return () => {
                socket.off('connect');
                socket.off('connectio_error');
            }
        }

        establishConnection();

    }, [])





    return (
        <>
            hello from homepage
        </>
    )
}