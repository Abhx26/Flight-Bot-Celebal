import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    // Detect booking command
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
        language: 'en', // Optionally use user language
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
    <Paper elevation={3} sx={{ position: 'fixed', bottom: 16, right: 16, width: 320, p: 2, zIndex: 1000 }}>
      <Typography variant="h6">Travel Assistant</Typography>
      <List sx={{ maxHeight: 200, overflow: 'auto' }}>
        {messages.map((msg, idx) => (
          <ListItem key={idx} sx={{ justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
            <Box bgcolor={msg.from === 'user' ? 'primary.light' : 'grey.200'} px={2} py={1} borderRadius={2}>
              {msg.text}
            </Box>
          </ListItem>
        ))}
      </List>
      <Box display="flex" mt={2}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          size="small"
          fullWidth
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
          inputRef={inputRef}
          disabled={loading}
        />
        <Button onClick={handleSend} variant="contained" sx={{ ml: 1 }} disabled={loading}>Send</Button>
      </Box>
    </Paper>
  );
}

export default Chatbot; 