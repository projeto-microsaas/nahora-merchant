import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

// Tipagem para a API do carrossel
// Tipagem para a API do carrossel
const CarouselApi = null;

// Tipagem para as props do contexto
const CarouselContextProps = {
    carouselRef: null,
    api: undefined,
    scrollPrev: () => {},
    scrollNext: () => {},
    canScrollPrev: false,
    canScrollNext: false,
    orientation: "horizontal",
    opts: undefined,
};

// Criação do contexto com tipagem explícita
const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}

export { CarouselContext, useCarousel, CarouselApi };