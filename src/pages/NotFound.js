import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Página Não Encontrada</h1>
      <p className="text-gray-600 mb-4">A página que você está procurando não existe.</p>
      <Button onClick={() => navigate("/")}>Voltar para o Início</Button>
    </div>
  );
};

export default NotFound;