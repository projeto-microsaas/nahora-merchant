import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import React from 'react';
const statusConfig = {
  pendente: { label: "Pendente", cor: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  aceito: { label: "Aceito", cor: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  em_entrega: { label: "Em entrega", cor: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  entregue: { label: "Entregue", cor: "bg-green-100 text-green-800 hover:bg-green-100" },
  cancelado: { label: "Cancelado", cor: "bg-red-100 text-red-800 hover:bg-red-100" }
};

const DeliveryHistoryTable = ({ entregas }) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm">ID</TableHead>
            <TableHead className="text-xs sm:text-sm">Data</TableHead>
            <TableHead className="text-xs sm:text-sm">Cliente</TableHead>
            <TableHead className="text-xs sm:text-sm">Endereço</TableHead>
            <TableHead className="text-xs sm:text-sm">Status</TableHead>
            <TableHead className="text-xs sm:text-sm">Valor</TableHead>
            <TableHead className="text-right text-xs sm:text-sm">Rastreio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entregas.map((entrega) => {
            const { label, cor } = statusConfig[entrega.status] || { label: entrega.status, cor: "bg-gray-100 text-gray-800" };

            return (
              <TableRow key={entrega.id}>
                <TableCell className="font-medium text-xs sm:text-sm">{entrega.id}</TableCell>
                <TableCell className="text-xs sm:text-sm">{entrega.data}</TableCell>
                <TableCell className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">{entrega.cliente}</TableCell>
                <TableCell className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px]">{entrega.endereco}</TableCell>
                <TableCell>
                  <Badge className={cor} variant="outline">
                    {label}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{entrega.custo}</TableCell>
                <TableCell className="text-right">
                  {entrega.linkRastreamento && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => window.open(entrega.linkRastreamento, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Ver
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryHistoryTable;