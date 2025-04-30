import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('merchant');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Iniciando processo de login com:', { email, password, role });

    try {
      const response = await login(email, password, role);
      console.log('Resposta completa do backend:', response);
      const { token } = response.data;
      if (!token) {
        console.log('Token não recebido do backend');
        setError('Token não recebido do backend. Tente novamente.');
        return;
      }
      console.log('Token recebido:', token);
      localStorage.setItem('userToken', token);
      console.log('Token salvo no localStorage:', localStorage.getItem('userToken'));
      // Adicionar um pequeno atraso para garantir que o localStorage foi atualizado
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Função:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="merchant">Comerciante</option>
            <option value="driver">Motorista</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
