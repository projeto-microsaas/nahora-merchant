import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const MerchantProductCard = ({ name, price, description, category }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col items-start">
        <h3 className="font-medium text-lg text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground">R$ {price.toFixed(2)}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {category && (
          <p className="text-xs text-accent-foreground mt-1 bg-accent p-1 rounded">
            {category}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantProductCard;