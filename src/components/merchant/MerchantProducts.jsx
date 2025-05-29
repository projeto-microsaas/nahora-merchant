import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MerchantProductCard } from "./MerchantProductCard";
import axios from "axios";

const MerchantProducts = () => {
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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Produtos</h1>
        <Button
          className="bg-javai-orange hover:bg-javai-orange/90"
          onClick={() => window.location.href = "/merchant/add-product"}
        >
          Adicionar Produto
        </Button>
      </div>
      {products.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {products.map((product) => (
            <MerchantProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantProducts;