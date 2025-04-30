import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      toast.error("Usuário não encontrado. Faça login novamente.");
      navigate("/");
    }
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard - {user?.role || "Usuário"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Bem-vindo, {user?.email || "Usuário"}!</p>
          <p>Você está logado como: {user?.role || "Desconhecido"}</p>
          <nav className="mt-4 space-x-4">
            <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
            <Link to="/orders" className="text-blue-500 hover:underline">Pedidos</Link>
            <Link to="/profile" className="text-blue-500 hover:underline">Perfil</Link>
          </nav>
          <Button onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            toast.success("Logout realizado com sucesso!");
            navigate("/");
          }} className="mt-4">
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;