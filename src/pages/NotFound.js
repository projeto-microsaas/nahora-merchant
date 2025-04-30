import React from "react";
     import { Button } from "../components/ui/button";
     import { useNavigate } from "react-router-dom";

     const NotFound = () => {
       const navigate = useNavigate();

       return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
           <h1 className="text-4xl font-bold mb-4">404 - Página Não Encontrada</h1>
           <p className="text-lg mb-6">Desculpe, a página que você está procurando não existe.</p>
           <Button onClick={() => navigate("/")}>Voltar para o Início</Button>
         </div>
       );
     };

     export default NotFound;
