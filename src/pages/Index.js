import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { toast } from "../components/ui/sonner";
import { login } from "../api/api";

const Index = () => {
  const [email, setEmail] = useState("merchant@example.com");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("Comerciante"); // Ajustado para "Comerciante"
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Verificando token existente no Index...');
    const token = localStorage.getItem("authToken");
    console.log('Token encontrado:', token);
    if (token) {
      console.log('Token encontrado, redirecionando para /dashboard');
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log('Iniciando login com:', { email, password, role });
      
      const response = await login(email, password, role);
      console.log('Resposta do login:', response.data);
      const { token, user } = response.data;
      console.log('Token recebido:', token);
      console.log('Usuário recebido:', user);
      
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log('Token salvo no localStorage:', localStorage.getItem("authToken"));
      console.log('Usuário salvo no localStorage:', localStorage.getItem("user"));
      
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error(error.response?.data?.message || "Falha na autenticação. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">NaHora Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Função</label>
              <select 
                id="role"
                className="w-full p-2 border rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Comerciante">Comerciante</option>
                <option value="Motorista">Motorista</option>
              </select>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Sistema de gerenciamento para comerciantes e entregadores
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;