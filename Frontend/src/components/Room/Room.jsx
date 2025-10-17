import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from "socket.io-client";
import './Room.css'

// const URL = 'http://localhost:4000';
const URL = 'https://meetiglebackend.onrender.com';

export default function Room({ name, localAudioTrack, localVideoTrack }) {

    const [searchParams, setSearchParams] = useSearchParams();
    // const name = searchParams.get('name');
    const [socket, setSocket] = useState(null);
    const [lobby, setLobby] = useState(true);

    const [sendingpc, setSendingpc] = useState(null);
    const [recievingpc, setRecievingpc] = useState(null);
    const [remoteVideoTrack, setRemoteVideoTrack] = useState(null)
    const [remoteAudioTrack, setRemoteAudioTrack] = useState(null)
    const [remoteMediaStream, setRemoteMediaStream] = useState(null);
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);



    useEffect(() => {

        const socket = io(URL, {
            transports: ["websocket"],
            // withCredentials: true,
        })

        socket.on('send-offer', async ({ roomId }) => {
            console.log('sending offer')
            setLobby(false);

            const pc = new RTCPeerConnection();

            setSendingpc(pc);

            // pc.addTrack(localAudioTrack);
            // pc.addTrack(localVideoTrack);

            if (localVideoTrack) {
                // console.error("added tack");
                console.log('localVideo track >>> ', localVideoTrack)
                pc.addTrack(localVideoTrack)
            }
            if (localAudioTrack) {
                // console.error("added tack");
                console.log(localAudioTrack)
                pc.addTrack(localAudioTrack)
            }

            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "sender",
                        roomId
                    })
                }
            }

            pc.onnegotiationneeded = async () => {
                console.log("on negotiation neeeded, sending offer");
                const sdp = await pc.createOffer();

                pc.setLocalDescription(sdp)
                socket.emit("offer", {
                    sdp,
                    roomId
                })
            }
        });


        // alert('send offer please...');


        socket.on('offer', async ({ roomId, sdp: remoteSdp }) => {
            console.log('recieved offer')
            setLobby(false);

            const pc = new RTCPeerConnection();
            pc.setRemoteDescription(remoteSdp);


            if (localVideoTrack) {
                console.log('localVideo track >>> ', localVideoTrack)
                pc.addTrack(localVideoTrack)
            }
            if (localAudioTrack) {
                console.log(localAudioTrack)
                pc.addTrack(localAudioTrack)
            }

            const sdp = await pc.createAnswer();

            pc.setLocalDescription(sdp)

            const stream = new MediaStream();

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
            setRemoteMediaStream(stream);

            setRecievingpc(pc);

            window.pcr = pc;


            // pc.ontrack = (({ track, type }) => {
            //     alert('ontrack')
            //     if (type === 'audio') {
            //         remoteVideoRef.current.srcObject.addTrack(track)
            //     }
            //     else {
            //         remoteVideoRef.current.srcObject.addTrack(track)
            //     }

            //     remoteVideoRef.current.play()

            // });

            pc.onicecandidate = async (e) => {
                if (!e.candidate) {
                    return;
                }
                console.log('inside on-ice-candidate on receiving side');

                if (e.candidate) {
                    socket.emit('add-ice-candidate', {
                        candidate: e.candidate,
                        type: 'receiver',
                        roomId
                    })
                }
            }

            socket.emit('answer', { roomId, sdp: sdp });



            setTimeout(() => {
                const track1 = pc.getTransceivers()[0].receiver.track;
                const track2 = pc.getTransceivers()[0].receiver.track;

                console.log(track1);

                if (track1.kind === 'video') {
                    setRemoteAudioTrack(track2)
                    setRemoteVideoTrack(track1)
                }
                else {
                    setRemoteAudioTrack(track1)
                    setRemoteVideoTrack(track2)

                }
                remoteVideoRef.current.srcObject.addTrack(track1);
                remoteVideoRef.current.srcObject.addTrack(track2);
                remoteVideoRef.current.play();
            }, 5000)
        })

        socket.on('answer', ({ roomId, sdp: remoteSdp }) => {
            setLobby(false);

            setSendingpc(pc => {
                pc?.setRemoteDescription(remoteSdp);
                return pc;
            })
            console.log('loop is closed');
        })

        socket.on('lobby', () => {
            setLobby(true);
        })

        socket.on('add-ice-candidate', ({ candidate, type }) => {
            console.log('add ice candidate from remote');
            console.log({ candidate, type })
            if (type == "sender") {
                setRecievingpc(pc => {
                    if (!pc) {
                        console.error('receiving pc not found');
                    }
                    else {
                        console.error(pc.ontrack);
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            } else {
                setSendingpc(pc => {
                    if (!pc) {
                        console.error('sending pc not found')

                    } else {
                        //console.error(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                });
            }
        })

        setSocket(socket);

    }, [name]);


    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
                localVideoRef.current.play();
            }
        }
    }, [localVideoRef.current])

    if (lobby) {
        return (
            <div>
                waiting for someone to connect
            </div>
        )
    }



    return (
        <div className="room-container">
            <div className="room-header">Hello, {name}</div>

            <div className="video-grid">
                <div className="video-container">
                    <video className="localVideo" ref={localVideoRef} autoPlay playsInline></video>
                    <span className="name-tag">You</span>
                </div>

                <div className="video-container">
                    <video className="remoteVideo" ref={remoteVideoRef} autoPlay playsInline></video>
                    <span className="name-tag">Peer</span>
                </div>
            </div>
        </div>
    )
}