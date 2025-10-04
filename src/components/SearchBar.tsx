import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="px-4 mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search reports, drafts..."
          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl border-none outline-none focus:bg-white focus:shadow-lg transition-all duration-200 placeholder-gray-500"
        />
      </div>
    </div>
  );
}