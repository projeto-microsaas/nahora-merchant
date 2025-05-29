import React from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

const NewCategoryDialog = ({ onCategoryAdded }) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token de autenticação não encontrado");

      const response = await axios.post(
        "http://localhost:5000/api/categories",
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCategoryAdded(response.data);
      setCategoryName("");
      setOpen(false);
      toast.success("Categoria adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar categoria: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-javai-orange hover:bg-javai-orange/90">Nova Categoria</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Categoria</DialogTitle>
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
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCategoryDialog;