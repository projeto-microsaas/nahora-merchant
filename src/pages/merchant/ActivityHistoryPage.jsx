import React from 'react';
import { useState, useEffect } from "react";
import { ArrowLeft, Package, ShoppingBag, FileText, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const ActivityHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await axios.get("http://localhost:5000/api/activity-history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data);
      } catch (error) {
        console.error("Error loading history:", error);
        toast({
          title: "Erro ao carregar histórico",
          description: "Tente novamente mais tarde",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case "delivery":
        return <Package className="h-8 w-8 text-javai-orange" />;
      case "product":
        return <ShoppingBag className="h-8 w-8 text-javai-orange" />;
      case "order":
        return <FileText className="h-8 w-8 text-javai-orange" />;
      default:
        return <Activity className="h-8 w-8 text-javai-orange" />;
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Histórico de Atividades</h1>
          <p className="text-muted-foreground">Acompanhe todas as atividades do seu estabelecimento</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-10 w-10 text-javai-orange animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start gap-4">
                {getActivityIcon(item.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm">{item.time}</span>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryPage;