"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { serviceTypes } from "@/lib/mock-data";

export function SearchFilter({ onSearch, onFilter, selectedType }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12">
      <div className="relative mb-8">
        <div
          className="absolute inset-0 rounded-2xl blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(131, 197, 190, 0.1) 0%, rgba(226, 149, 120, 0.1) 100%)",
          }}
        />
        <div
          className="relative p-2 rounded-2xl shadow-xl"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              type="text"
              placeholder="Search for pet services... 🔍"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400"
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {serviceTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => onFilter(type)}
            className="transition-all duration-300 hover:scale-105 px-6 py-3 rounded-xl font-semibold"
            style={{
              background:
                selectedType === type
                  ? "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.9) 100%)"
                  : "rgba(255, 255, 255, 0.8)",
              color: selectedType === type ? "white" : "#83C5BE",
              border:
                selectedType === type
                  ? "none"
                  : "2px solid rgba(131, 197, 190, 0.3)",
              boxShadow:
                selectedType === type
                  ? "0 10px 25px -5px rgba(226, 149, 120, 0.4)"
                  : "none",
              backdropFilter: "blur(10px)",
            }}
          >
            <Filter className="w-4 h-4 mr-2" />
            {type}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default SearchFilter;
