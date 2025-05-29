import React from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const EditCategoryDialog = ({ category, onCategoryUpdated }) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autenticação não encontrado");

      const response = await axios.put(
        `http://localhost:5000/api/categories/${category.id}`,
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCategoryUpdated(response.data);
      setOpen(false);
      toast.success("Categoria atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar categoria: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ex: Lanches"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-javai-orange hover:bg-javai-orange/90">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;