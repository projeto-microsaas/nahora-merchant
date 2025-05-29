import React from 'react';
import { CartItemCard } from "./CartItemCard";
import { Input } from "../../ui/input";
import { Search } from "lucide-react";

const ProductList = ({ cartItems, setCartItems, searchTerm, setSearchTerm }) => {
  // Placeholder for product search logic
  const handleAddItem = (product) => {
    setCartItems([...cartItems, { ...product, quantity: 1, observations: "" }]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 text-sm sm:text-base w-full"
        />
      </div>
      <div className="space-y-3">
        {cartItems.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            onUpdateQuantity={(id, quantity) => {
              setCartItems(cartItems.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
            }}
            onUpdateObservations={(id, observations) => {
              setCartItems(cartItems.map(i => i.id === id ? { ...i, observations } : i));
            }}
            onRemoveItem={(id) => {
              setCartItems(cartItems.filter(i => i.id !== id));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;