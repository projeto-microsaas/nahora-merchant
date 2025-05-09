import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      console.log("Token salvo:", response.data.token); // Debug
      navigate("/deliveries/dashboard");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-javai-purple text-white p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;