// src/components/PlaceholderImage.js
import React from "react";

const PlaceholderImage = ({
  className = "",
  alt = "Placeholder Image",
  width = 1200,
  height = 1200,
  src,
}) => {
  const imageSrc = src || "/placeholder.svg";

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover rounded-md ${className}`}
      onError={(e) => {
        const target = e.target;
        if (target.src !== "/placeholder.svg") target.src = "/placeholder.svg"; // Fallback para placeholder
      }}
    />
  );
};

export default PlaceholderImage;