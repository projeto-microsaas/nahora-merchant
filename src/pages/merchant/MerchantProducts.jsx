import React from 'react';
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MerchantProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await axios.get("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-javai-orange"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Produtos</h1>
        <Button
          className="bg-javai-orange hover:bg-javai-orange-dark text-white"
          onClick={() => navigate("/merchant/products/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>
      {products.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p>Nenhum produto encontrado. Adicione um novo produto para começar.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-start">
                <h3 className="font-medium text-lg text-foreground">{product.name}</h3>
                <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                )}
                {product.category && (
                  <p className="text-xs text-accent-foreground mt-1 bg-accent p-1 rounded">
                    {product.category}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantProducts;
