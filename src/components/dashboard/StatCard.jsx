import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import React from 'react';
import { Badge } from '../components/ui/badge';
import React from 'react';
import { Button } from '../components/ui/button';
import React from 'react';
import { Clock, ExternalLink, MapPin, User, Navigation } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const statusConfig = {
  pendente: { label: "Pendente", cor: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  aceito: { label: "Aceito", cor: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  em_entrega: { label: "Em entrega", cor: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  entregue: { label: "Entregue", cor: "bg-green-100 text-green-800 hover:bg-green-100" }
};

const DeliveryStatusCard = ({ id, cliente, endereco, status, tempo, linkRastreamento }) => {
  const { label, cor } = statusConfig[status] || { label: status, cor: "bg-gray-100 text-gray-800" };

  return (
    <Card className="overflow-hidden w-full max-w-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          Pedido #{id}
        </CardTitle>
        <Badge className={cor} variant="outline">
          {label}
        </Badge>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <User className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{cliente}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">{endereco}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
            <span className="text-sm">{tempo}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-2">
            {linkRastreamento && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs w-full flex items-center"
                onClick={() => window.open(linkRastreamento, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                Link de rastreio
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-xs w-full flex items-center"
              asChild
            >
              <Link to={`/acompanhar/${id}`}>
                <Navigation className="h-3.5 w-3.5 mr-1" />
                Acompanhar
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryStatusCard;