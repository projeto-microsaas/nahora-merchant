import { Search } from "lucide-react";

const DriverSearchBox = () => {
  return (
    <div className="p-4">
      <div className="bg-zinc-800 rounded-full flex items-center px-4 py-2 sm:py-3">
        <Search className="h-5 w-5 text-zinc-400 mr-2" />
        <span className="text-zinc-400 text-sm sm:text-base">Para onde?</span>
      </div>
    </div>
  );
};

export default DriverSearchBox;