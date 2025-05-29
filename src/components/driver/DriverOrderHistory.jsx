import { useState, useEffect } from "react";

const DriverOrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // TODO: Fetch orders from API
    setOrders([
      { id: 1001, restaurant: "Restaurante Bella Italia", time: "Hoje, 14:31", earnings: 10.50 },
      { id: 1002, restaurant: "Restaurante Bella Italia", time: "Hoje, 14:32", earnings: 11.50 },
      { id: 1003, restaurant: "Restaurante Bella Italia", time: "Hoje, 14:33", earnings: 12.50 },
    ]);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Seus Pedidos</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-zinc-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-sm sm:text-base">Pedido #{order.id}</p>
              <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">Concluído</span>
            </div>
            <p className="text-sm text-zinc-400">{order.restaurant}</p>
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-zinc-700">
              <span className="text-zinc-400">{order.time}</span>
              <span className="text-green-500">R$ {order.earnings.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverOrderHistory;