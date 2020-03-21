import React, {useEffect, useState} from "react";
import Peer from "peerjs";

const WebRTC = () => {

    const [peer, setPeer] = useState(null)
    const [myID, setMyID] = useState('')
    const [partnerID, setPartnerID] = useState('')
    const [locked, setLocked] = useState(false)
    const [conn, setConnection] = useState(null)

    useEffect(() => {
        const peer = new Peer()
        peer.on('open', function (id) {
            setMyID(id)
        });
        setPeer(peer)
    }, [])


    const connect = () => {
        setLocked(true)

        let conn = peer.connect(partnerID);
        setConnection(conn)
        //if (conn._open) {
        console.log(conn)
        conn.on('open', () => {
            console.log(1)
            // Receive messages
            conn.on('data', (data) => {
                console.log('Received', data);
            });
            console.log(2)

            // Send messages
            setInterval(() => {
                conn.send('Hello!');
                console.log(3)
            }, 1000)


        });
        /*}
        else {
          setLocked(false)
        }*/

    }

    return (
        <div>
            <div>My WebRTC ID is: {myID} </div>
            <div>Partner ID: {partnerID}</div>
            <input disabled={locked} value={partnerID} onChange={(e) => setPartnerID(e.target.value)}/>
            <button disabled={locked} onClick={() => connect()}>Connect me =)</button>
        </div>
    );
}

export default WebRTC;
