import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Orders = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aqui você verá a lista de pedidos (em desenvolvimento).</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;

