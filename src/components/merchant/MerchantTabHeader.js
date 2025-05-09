const MerchantTabHeader = ({ storeName }) => {
    return (
      <div className="fixed top-0 left-0 w-full bg-gray-800 shadow-md p-4 z-10">
        <h1 className="text-xl font-bold text-white">{storeName}</h1>
      </div>
    );
  };

  export default MerchantTabHeader;