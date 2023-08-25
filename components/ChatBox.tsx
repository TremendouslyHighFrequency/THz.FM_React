import React, { useState, useEffect, useRef } from 'react';

const ChatBox = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const chatBoxRef = useRef(null);
    const messagesEndRef = useRef(null);

useEffect(() => {
    // Establish a socket connection using the native WebSocket API
    const socket = new WebSocket('wss://thz.fm/socket.io/'); // Adjust the URL if needed

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'receive-message') {
        const msg = data.message;
        const isAtBottom = chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop === chatBoxRef.current.clientHeight;
        setChat(prevChat => [...prevChat, msg]);
        if (isAtBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    return () => socket.close(); // Close the socket connection on component unmount
}, []);

const sendMessage = () => {
    // Use standard fetch to make an API call to Frappe to broadcast the message
    fetch('https://thz.fm/api/method/frappe.socketio.send_message?message=' + encodeURIComponent(message), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "Message broadcasted successfully") {
        setMessage(''); // Clear input only if message was successfully sent
      } else {
        console.error("Error sending message:", data.error);
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
