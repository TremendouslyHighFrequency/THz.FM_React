import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const socket = io('YOUR_FRAPPE_BACKEND_URL');  // Replace with your Frappe backend URL
  
  useEffect(() => {
    socket.on('receive-message', (msg) => {
      setChat([...chat, msg]);
    });
    return () => socket.disconnect();
  }, [chat]);

  const sendMessage = () => {
    socket.emit('send-message', message);
    setMessage('');
  }

  return (
    <div>
      <div>
        {chat.map((msg, index) => <div key={index}>{msg}</div>)}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatBox;
