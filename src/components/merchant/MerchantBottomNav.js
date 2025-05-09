const MerchantBottomNav = ({ activeTab, setActiveTab }) => {
    const tabs = [
      { id: "home", label: "Início" },
      { id: "products", label: "Produtos" },
      { id: "orders", label: "Pedidos" },
      { id: "profile", label: "Perfil" },
    ];

    return (
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 shadow-md flex justify-around p-2 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === tab.id ? "text-javai-orange border-t-2 border-javai-orange" : "text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  export default MerchantBottomNav;