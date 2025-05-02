import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api.js'; // Caminho corrigido

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Comerciante');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Iniciando login com:', { email, password, role });
      const response = await login({ email, password, role });
      console.log('Resposta do backend:', response);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      console.log('Token e usuário salvos no localStorage');
      console.log('Redirecionando para /dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Senha</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Função</label>
          <select
            className="form-control"
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

export default LoginPage;