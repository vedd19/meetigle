import { useEffect, useRef, useState } from "react"
import './Homepage.css'
import { Button, CircularProgress, Skeleton } from '@mui/material'



import { io } from "socket.io-client";

const socket = io("http://localhost:4000");




export default function Homepage() {


    const myVideoRef = useRef(null);
    const peerVideoRef = useRef(null);
    const [isBuffer, setIsBuffer] = useState(false);
    const [isMatched, setIsMatched] = useState(false);

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
    }, []);

    const handleMatched = (partnerId) => {

    }

    const handleStart = () => {
        setIsBuffer(true);
        const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

        socket.on('waiting',)
        socket.on('matched', (data) => { handleMatched(data.partnerId) });
    }


    return (
        <div>

            <div className="mainDiv">
                <div className="video-div container d-flex gap-1">
                    <div className="peerVideoDiv vd">
                        {(!isMatched) ? (<Skeleton
                            sx={{ bgcolor: 'grey.900', borderRadius: '1rem' }}
                            variant="rectangular"
                            width={'100%'}
                            height={'100%'}
                        />) : (<video id="peerVideo" autoPlay />)}
                        {isBuffer && <div className="circular-progress-bar"><CircularProgress /></div>}
                    </div>


                    <div className="myVideoDiv vd">
                        <video id="myVideo" autoPlay ref={myVideoRef} />
                    </div>
                </div>
            </div>

            <div className="buttonDiv d-flex justify-content-center mt-3">
                <Button variant="contained" onClick={handleStart}>Start</Button>
            </div>





        </div>
    )
}