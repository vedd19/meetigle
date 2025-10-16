import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Room from "../Room/Room";
import './Landing.css'

export default function Landing() {

    const [name, setName] = useState('');
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [localVideoTrack, setlocalVideoTrack] = useState(null);
    const videoRef = useRef(null);

    const [joined, setJoined] = useState(false);

    const getCam = async () => {
        const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        const audioTrack = stream.getAudioTracks()[0];
        const videoTrack = stream.getVideoTracks()[0];

        setLocalAudioTrack(audioTrack)
        setlocalVideoTrack(videoTrack)


        if (!videoRef.current) {
            return;
        }

        videoRef.current.srcObject = new MediaStream([videoTrack]);
        videoRef.current.play()

    }


    useEffect(() => {

        if (videoRef && videoRef.current) {
            getCam();
        }

    }, [videoRef])

    if (!joined) {


        return (
            <div className="landing-video-div">
                <video id="landingVideo" ref={videoRef} autoPlay></video>
                <input id="landing-input" type="text" onChange={(e) => setName(e.target.value)} />

                <button id="button" onClick={() => {
                    setJoined(true);
                }}>Join</button>
            </div>
        )
    }

    return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}