import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="main-card">
      <div className="bold-header">Login</div>
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} className="form-field" />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} className="form-field" />
      {error && <Typography color="error" style={{ marginBottom: 16 }}>{error}</Typography>}
      <button className="primary-btn" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login; 