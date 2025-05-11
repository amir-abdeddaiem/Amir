"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProductFilters from "./ProductFilters";

export function MobileProductFilters({ open, onClose, ...filterProps }) {
  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-xl ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-[#E29578]">Filters</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="overflow-y-auto h-full pb-20">
        <ProductFilters {...filterProps} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          className="w-full bg-[#E29578] hover:bg-[#E29578]/90"
          onClick={onClose}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
