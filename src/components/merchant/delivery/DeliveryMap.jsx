import React from 'react';
import React, { useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';

const DeliveryMap = ({ className }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Em uma implementação real, aqui integraria uma API de mapas
    // como Google Maps, Mapbox, etc.
    if (mapRef.current) {
      const mapContainer = mapRef.current;
      mapContainer.style.backgroundImage = "url('https://miro.medium.com/v2/resize:fit:1400/1*qYUvh-EtEt8dtgKiBRiLsA.png')";
      mapContainer.style.backgroundSize = "cover";
      mapContainer.style.backgroundPosition = "center";
    }
  }, []);

  return (
    <div className={cn("relative w-full h-64 sm:h-80 md:h-96", className)}>
      <div ref={mapRef} className="absolute inset-0 z-0" />
      
      {/* Simulação do caminho do entregador */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-1 sm:w-2 h-1/2 sm:h-3/4 bg-javai-purple z-10" />
      
      {/* Simulação do ícone do entregador */}
      <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="h-5 sm:h-6 w-5 sm:w-6 bg-white rounded-full border-2 border-javai-purple flex items-center justify-center shadow-md">
          <div className="h-2.5 sm:h-3 w-2.5 sm:w-3 bg-javai-purple rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;