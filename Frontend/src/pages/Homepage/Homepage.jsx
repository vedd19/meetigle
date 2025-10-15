import { useEffect, useRef, useState } from "react"
import './Homepage.css'
import { Button, CircularProgress, Skeleton } from '@mui/material'



import { io } from "socket.io-client";

const socket = io("http://localhost:4000");




export default function Homepage() {


    const myVideoRef = useRef(null);
    const peerVideoRef = useRef(null);
    const localStreamRef = useRef(null);
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
                    localStreamRef.current = stream;
                    myVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.log('error accessing audio/video ', err)
            }

        }

        startCamera();
    }, []);

    const handleMatched = async (partnerId) => {

        const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

        const stream = localStreamRef.current;

        if (stream) {
            console.log("getting tracks")
            // setIsBuffer(false)
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        peer.ontrack = (event) => {
            if (peerVideoRef.current) {
                setIsMatched(true);
                peerVideoRef.current.srcObject = event.streams[0];
                console.log("peerVideo");
            }

            console.log('heelo')
        }

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('iceCandidate', { candidate: event.candidate, partnerId })
            }
        }

        //if i was the one who got matched first, i create the offer, since both are unique strings, any one of them will definitly smaller.

        if (socket.id < partnerId) {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            socket.emit('offer', { sdp: offer, partnerId });
        }

        socket.on('offer', async ({ sdp, from }) => {
            await peer.setRemoteDescription({ type: sdp.type, sdp: sdp.sdp });
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            socket.emit('answer', { sdp: answer, partnerId: from })
        });

        socket.on('answer', async ({ sdp }) => {
            await peer.setRemoteDescription({ type: sdp.type, sdp: sdp.sdp });
        });

        socket.on('iceCandidate', async (candidate) => {
            try {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('error while adding received ice candidate', err);
            }
        })
    }

    const handleStart = () => {
        // setIsBuffer(true);

        socket.on('waiting', () => console.log('waiting for partner!'))
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
                        />) : (<video id="peerVideo" autoPlay ref={peerVideoRef} />)}
                        {/* {isBuffer && <div className="circular-progress-bar"><CircularProgress /></div>} */}
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