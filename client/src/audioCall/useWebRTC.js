import React, {useEffect, useState} from "react";
import Peer from "peerjs";

export const useWebRTC = (user) => {

    const [peer, setPeer] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [partners, setPartners] = useState([]);

    useEffect(() => {

        console.log('user: ', user)

        if (user.uuid !== undefined) {

          console.log('This is the userid:' + user.nickname)

          const peer = new Peer(user.uuid);
          let activeStreams = [];
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
          peer.on('call', (call) => {
            console.log(call);

            call.answer();
            call.on('error', console.log);
            call.on('stream', (stream) => {
                console.log(stream);
                console.log(activeStreams);

                if (!activeStreams.includes(call.peer)) {
                  activeStreams.push(call.peer);
                  console.log(activeStreams);
                  console.log('received audio stream, strarting playing');
                  if (stream.getVideoTracks().length > 0) {
                    appendVideoStream(stream)
                  } else {
                    appendAudioStream(stream)
                  }
                }
              }
            );
          });
          setPeer(peer);
        }
      },
      [user]
    );

    const appendVideoStream = (stream) => {

      let audio = document.createElement('video');
      audio.width = 800;
      audio.controls = true;
      audio.srcObject = stream;
      audio.onloadedmetadata = () => {
        console.log('now playing the audio');
        audio.play();
      };
      let parentAudio = document.getElementById('parentAudio');
      parentAudio.appendChild(audio)
    };

    const appendAudioStream = (stream) => {

      let audio = document.createElement('audio');
      audio.srcObject = stream;
      audio.onloadedmetadata = () => {
        console.log('now playing the audio');
        audio.play();
      };
      let parentAudio = document.getElementById('parentAudio');
      parentAudio.appendChild(audio)
    };

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
    };


    const connect_send = (messageContent) => {

      partners.forEach((p) => {
        console.log('Sending to partner ' + p.peerId);
        p.connection.on('error', console.log);
        p.connection.send(messageContent);
      });
      setMessageHistory((prevState) => {
        return [
          ...prevState,
          {
            sender: user.nickname,
            content: messageContent
          }]
      });
    };

    const callPartner = (vid) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
            video: vid
          })

          // Success callback
          .then(function (stream) {
            console.log(stream.getAudioTracks());
            partners.forEach((p) => {
              console.log('Sending to partner ' + p.peerId);
              peer.call(p.peerId, stream);
              console.log('Start streaming');
            });

          })

          // Error callback
          .catch(function (err) {
              console.log('The following getUserMedia error occured: ' + err);
            }
          );
      } else {
        console.log('getUserMedia not supported on your browser!');
      }

    };

    return{
      add_partner,
      connect_send,
      callPartner,
      partners,
      messageHistory
    }
  };
