// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nahora-orange": "#FF7300",
        "nahora-orange-light": "#FF9640",
        "nahora-orange-dark": "#CC5C00",
        "nahora-purple": "#8B5CF6",
        "nahora-purple-light": "#A78BFA",
        "nahora-purple-dark": "#7C3AED",
        "nahora-gray": "#F3F4F6",
        "nahora-gray-dark": "#4B5563",
        // Variáveis de tema escuro
        background: "hsl(222.2 84% 4.9%)",
        foreground: "hsl(210 40% 98%)",
        primary: "hsl(30 100% 50%)", // Laranja principal
        secondary: "hsl(217.2 32.6% 17.5%)",
        muted: "hsl(217.2 32.6% 17.5%)",
        card: "hsl(222.2 84% 4.9%)",
        // Variáveis de tema claro (opcional para futura implementação)
        "light-background": "hsl(0 0% 100%)",
        "light-foreground": "hsl(222.2 84% 4.9%)",
        "light-primary": "hsl(30 100% 50%)",
        "light-secondary": "hsl(210 40% 96.1%)",
        "light-muted": "hsl(210 40% 96.1%)",
        "light-card": "hsl(0 0% 100%)",
        // Cores de interface
        success: "bg-green-500",
        warning: "bg-yellow-500/20 text-yellow-500",
        destructive: "bg-red-500",
        // Cores de texto
        "text-highlight": "#FF7300", // nahora-orange para preços
        // Cores de borda
        "border-input": "border-zinc-800",
        "border-muted": "border-muted",
        // Cores da barra lateral
        "sidebar-bg-dark": "hsl(240 5.9% 10%)",
        "sidebar-fg-dark": "hsl(240 4.8% 95.9%)",
        "sidebar-border-dark": "hsl(240 3.7% 15.9%)",
        "sidebar-bg-light": "hsl(0 0% 98%)",
        "sidebar-fg-light": "hsl(240 5.3% 26.1%)",
        "sidebar-border-light": "hsl(220 13% 91%)",
      },
    },
  },
  plugins: [],
};