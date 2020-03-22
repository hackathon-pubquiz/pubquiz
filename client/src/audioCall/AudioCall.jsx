import React, {useState} from "react";
import {useWebRTC} from "./useWebRTC";

const AudioCall = ({user}) => {

  const {
    add_partner,
    connect_send,
    callPartner,
    partners,
    messageHistory
  } = useWebRTC(user);

  const [partnerID, setPartnerID] = useState('');
  const [messageContent, setMessageContent] = useState(null);


  const partnerContent = partners.map((e) => {
    return <div>{e.peerId}</div>
  });

  const computeHistory = messageHistory.map((e) => {
    return <div>{e.sender}: {e.content}</div>
  });

  return (
    <div>
      <div>My WebRTC ID is: {user.uuid} </div>
      <div>Partner ID: {partnerContent}</div>
      <div>
        <input value={partnerID} onChange={(e) => setPartnerID(e.target.value)}/>
        <button onClick={() => add_partner(partnerID)}>Add a partner</button>
      </div>
      <div>
        <input value={messageContent} onChange={(e) => setMessageContent(e.target.value)}/>
        <button onClick={() => connect_send(messageContent)}>Send Message</button>
      </div>
      <div>
        <button onClick={() => callPartner(false)}>Call group</button>
      </div>
      <div>
        <button onClick={() => callPartner(true)}>Video Call</button>
      </div>
      <div>{computeHistory}</div>
      <div id={'parentAudio'}/>
    </div>
  );
};

export default AudioCall;