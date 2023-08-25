import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const socket = io('https://thz.fm:9000');
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    socket.on('receive-message', (msg) => {
      const isAtBottom = chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop === chatBoxRef.current.clientHeight;
      setChat(prevChat => [...prevChat, msg]);
      if (isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    socket.emit('send-message', message);
    setMessage('');
  }

  return (
    <div>
      <div ref={chatBoxRef}>
        {chat.map((msg, index) => <div key={index}>{msg}</div>)}
        <div ref={messagesEndRef}></div>
      </div>
      <div>
        <input className="bg-white" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
