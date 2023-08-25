import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const ChatBox = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const chatBoxRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
      // Establish a socket connection using Socket.IO client
      const socket = io('https://thz.fm:9000', { transports: ['websocket'] });

      socket.on('message_event', (data) => {
        console.log("Received data:", data);
        const msg = data.message;
          const isAtBottom = chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop === chatBoxRef.current.clientHeight;
          setChat(prevChat => [...prevChat, msg]);
          if (isAtBottom) {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }
      });

      return () => socket.disconnect(); // Disconnect the socket on component unmount
    }, []);

    const sendMessage = () => {
      axios.get(`https://thz.fm/api/method/frappe.socketio.send_message?message=` + encodeURIComponent(message))
      .then(response => {
          const responseData = response.data; // Extract data from Axios response
          if (responseData.message && responseData.message.status === "Message broadcasted successfully") {
              setMessage('');
          } else if (responseData.message && responseData.message.error) {
              console.error("Error sending message:", responseData.message.error);
          } else {
              console.error("Unexpected API response:", responseData);
          }
      })
      .catch(error => {
          console.error("Error calling the API:", error);
      });
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
