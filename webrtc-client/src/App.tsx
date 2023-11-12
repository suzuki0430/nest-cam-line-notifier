// src/App.tsx
import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const App: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = new RTCPeerConnection();
  const socket = io('http://localhost:5000'); // signaling-serverのURL

  useEffect(() => {
    // シグナリングサーバーからのメッセージを受信
    socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', answer);
      } catch (error) {
        console.error(error);
      }
    });

    // ICE候補の処理
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', event.candidate);
      }
    };

    // リモートストリームの処理
    peerConnection.ontrack = (event) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = event.streams[0];
      }
    };

    // シグナリングサーバーへの接続
    socket.emit('join', 'client-room');

    return () => {
      socket.disconnect();
      peerConnection.close();
    };
  }, []);

  return (
    <div>
      <h1>WebRTC Client</h1>
      <video ref={localVideoRef} autoPlay playsInline />
    </div>
  );
};

export default App;
