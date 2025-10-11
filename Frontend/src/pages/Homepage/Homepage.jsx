import { useEffect, useRef } from "react"
import './Homepage.css'



import { io } from "socket.io-client";

const socket = io("http://localhost:4000");




export default function Homepage() {


    const myVideoRef = useRef(null);
    const peerVideoRef = useRef(null);

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


    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.log('error accessing audio/video ', err)
            }

        }

        startCamera();
    }, [])





    return (
        <div>

            <div className="mainDiv">
                <div className="video-div container d-flex gap-1">
                    <div className="myVideoDiv vd">
                        <video id="myVideo" autoPlay ref={myVideoRef} />
                    </div>
                    <div className="peerVideoDiv vd">
                        <video id="peerVideo" autoPlay ref={myVideoRef} />
                    </div>
                </div>
            </div>




        </div>
    )
}