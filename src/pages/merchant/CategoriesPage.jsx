import React from 'react';
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NewCategoryDialog } from "@/components/merchant/category/NewCategoryDialog";
import { EditCategoryDialog } from "@/components/merchant/category/EditCategoryDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await axios.get("http://localhost:5000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">Categorias de Produtos</h2>
      </div>

      <div className="flex justify-end">
        <NewCategoryDialog onCategoryAdded={(newCategory) => setCategories([...categories, newCategory])} />
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.productCount} produtos</p>
                </div>
                <EditCategoryDialog category={category} onCategoryUpdated={(updated) => setCategories(categories.map(c => c.id === updated.id ? updated : c))} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;