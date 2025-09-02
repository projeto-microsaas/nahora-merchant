import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../lib/axios";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log("Tentando registrar com:", { email, password });
      const response = await axios.post("/api/auth/register", { email, password });
      console.log("Resposta do registro:", response.data);
      setSuccess("Usuário registrado com sucesso! Redirecionando para o login...");
      setError(null);
      setTimeout(() => navigate("/login"), 2000); // Redireciona após 2 segundos
    } catch (err) {
      console.error("Erro no registro:", err.message, err.response?.status, err.response?.data);
      setError(err.response?.data?.message || "Erro ao registrar usuário");
      setSuccess(null);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Registrar</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>Registrar</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      <p style={{ marginTop: "10px" }}>
        Já tem uma conta? <a href="/login">Faça login aqui</a>.
      </p>
    </div>
  );
};

export default RegisterPage;