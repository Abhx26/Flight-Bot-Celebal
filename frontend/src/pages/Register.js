import React, { useState } from 'react';
import { TextField, Typography, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../App.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { name, email, password, language });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="main-card">
      <div className="bold-header">Register</div>
      <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} className="form-field" />
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} className="form-field" />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} className="form-field" />
      <Select value={language} onChange={e => setLanguage(e.target.value)} fullWidth className="form-field">
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Español</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
      </Select>
      {error && <Typography color="error" style={{ marginBottom: 16 }}>{error}</Typography>}
      <button className="primary-btn" onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register; 