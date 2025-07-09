import React, { useState, useRef } from 'react';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Chatbot({ onEntities, onBookFromChat }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you with your travel plans today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { from: 'user', text: input }]);
    setLoading(true);
    if (/book (the )?(first|cheapest|best) flight/i.test(input)) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Booking the selected flight for you...' }]);
      if (onBookFromChat) onBookFromChat('first');
      setInput('');
      setLoading(false);
      inputRef.current?.focus();
      return;
    }
    try {
      const res = await axios.post('http://localhost:5005/api/bot/message', {
        message: input,
        language: 'en',
      });
      setMessages((msgs) => [...msgs, { from: 'bot', text: res.data.reply }]);
      if (res.data.entities && Object.keys(res.data.entities).length > 0 && onEntities) {
        onEntities(res.data.entities);
      }
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Sorry, I could not understand. Please try again.' }]);
    }
    setInput('');
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, width: 320, zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 400 }}>
        <Typography variant="h6" style={{ fontWeight: 700, color: '#1976d2', marginBottom: 12 }}>Travel Assistant</Typography>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
              <div style={{ background: msg.from === 'user' ? '#e3f0fc' : '#f3f3f3', color: '#222', padding: '8px 14px', borderRadius: 12, maxWidth: 220, fontSize: 15 }}>{msg.text}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            size="small"
            fullWidth
            placeholder="Type your message..."
            onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
            inputRef={inputRef}
            disabled={loading}
            className="form-field"
          />
          <button className="primary-btn" style={{ width: 80, marginTop: 0 }} onClick={handleSend} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot; 