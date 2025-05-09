import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/services/api';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Comerciante');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/login', { email, password });
      console.log("Token salvo:", response.data.token);
      localStorage.setItem('token', response.data.token);
      navigate('/merchant'); // Redireciona para /merchant
    } catch (err) {
      console.error('Erro ao fazer login:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email-input" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password-input" className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            id="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role-input" className="form-label">Função</label>
          <select
            className="form-control"
            id="role-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Comerciante">Comerciante</option>
            <option value="Motorista">Motorista</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Index;