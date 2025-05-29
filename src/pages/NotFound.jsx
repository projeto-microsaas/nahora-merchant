import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-javai-purple mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Ops! Página não encontrada</p>
        <p className="text-gray-500 mb-8">A página que você está procurando não existe ou foi movida.</p>
        <Button className="bg-javai-purple hover:bg-javai-purple-dark" onClick={() => window.location.href = "/"}>
          <Home className="mr-2 h-4 w-4" /> Voltar para o Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;