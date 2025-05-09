// src/components/dashboard/DeliveryHistoryTable.js
import React from "react";
import Button from "../ui/button"; // Ajustado para import default
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const statusConfig = {
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-500" },
  accepted: { bg: "bg-blue-500/20", text: "text-blue-500" },
  picked: { bg: "bg-indigo-500/20", text: "text-indigo-500" },
  delivered: { bg: "bg-green-500", text: "text-white" },
  cancelled: { bg: "bg-red-500", text: "text-white" },
};

function DeliveryHistoryTable({ deliveries }) {
  return (
    <div className="rounded-md border border-input">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-300">ID</TableHead>
            <TableHead className="text-gray-300">Data</TableHead>
            <TableHead className="text-gray-300">Cliente</TableHead>
            <TableHead className="text-gray-300">Endereço</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Valor</TableHead>
            <TableHead className="text-gray-300">Rastreio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveries.map((delivery) => (
            <TableRow key={delivery.id} className="hover:bg-muted/50">
              <TableCell className="text-foreground">{delivery.id}</TableCell>
              <TableCell className="text-foreground">{delivery.date}</TableCell>
              <TableCell className="text-foreground">{delivery.customer}</TableCell>
              <TableCell className="max-w-[200px] truncate text-foreground">{delivery.address}</TableCell>
              <TableCell>
                <Badge
                  className={`${statusConfig[delivery.status].bg} ${statusConfig[delivery.status].text} rounded-full`}
                >
                  {delivery.status}
                </Badge>
              </TableCell>
              <TableCell className="text-nahora-orange">{delivery.cost}</TableCell>
              <TableCell>
                {delivery.trackingLink && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Rastrear: ${delivery.trackingLink}`)}
                  >
                    Ver
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DeliveryHistoryTable;