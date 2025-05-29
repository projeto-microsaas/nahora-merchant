import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function DeliveryMap({ className }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const mapContainer = mapRef.current;
      mapContainer.style.backgroundImage = "url('https://miro.medium.com/v2/resize:fit:1400/1*qYUvh-EtES8dtgKiBRiLsA.png')";
      mapContainer.style.backgroundSize = "cover";
      mapContainer.style.backgroundPosition = "center";
    }
  }, []);

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div ref={mapRef} className="absolute inset-0 z-0" />
      
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-2 h-3/4 bg-javai-purple z-10" />
      
      <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="h-6 w-6 bg-white rounded-full border-2 border-javai-purple flex items-center justify-center shadow-md">
          <div className="h-3 w-3 bg-javai-purple rounded-full" />
        </div>
      </div>
    </div>
  );
}