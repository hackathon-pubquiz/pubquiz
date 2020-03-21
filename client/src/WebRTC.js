import React, {useEffect, useState} from "react";
import Peer from "peerjs";

const WebRTC = () => {

    const [peer, setPeer] = useState(null);
    const [myID, setMyID] = useState('');
    const [partnerID, setPartnerID] = useState('');
    const [messageContent, setMessageContent] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const peer = new Peer();
        peer.on('open', function (id) {
            setMyID(id)
        });
        peer.on('connection', (con) => {
            console.log(con);
            con.on('error', console.log);
            con.on('open', () => {
                con.on('data', (data) => {
                    setMessageHistory((prevState) => {
                        return [
                            ...prevState,
                            {
                                sender: con.peer,
                                content: data
                            }]
                    })
                });
            });
        });
        setPeer(peer)
    }, []);


    const add_partner = (p) => {
        const connection = peer.connect(p);
        setPartners((prevState) => {
            return [
                ...prevState,
                {
                    peerId: p,
                    connection: connection
                }]
        });
        setPartnerID('')

    };


    const connect_send = (messageContent) => {

        partners.forEach((p) => {
            p.connection.on('error', console.log);
            p.connection.send(messageContent);
        });
        setMessageHistory((prevState) => {
            return [
                ...prevState,
                {
                    sender: myID,
                    content: messageContent
                }]
        });
        setMessageContent('')
    };

    const partnerContent = partners.map((e) => {
        return <div>{e.peerId}</div>
    });

    const computeHistory = messageHistory.map((e) => {
        return <div>{e.sender}: {e.content}</div>
    });

    return (
        <div>
            <div>My WebRTC ID is: {myID} </div>
            <div>Partner ID: {partnerContent}</div>
            <div>
                <input value={partnerID} onChange={(e) => setPartnerID(e.target.value)}/>
                <button onClick={() => add_partner(partnerID)}>Add a partner</button>
            </div>
            <div>
                <input value={messageContent} onChange={(e) => setMessageContent(e.target.value)}/>
                <button onClick={() => connect_send(messageContent)}>Send Message</button>
            </div>
            <div>{computeHistory}</div>
        </div>
    );
};

export default WebRTC;
