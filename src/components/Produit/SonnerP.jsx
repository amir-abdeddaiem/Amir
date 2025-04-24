"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function SonnerP() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Produit ajouté au panier!", {
          description: "Produit ajouté au panier!",
          action: {
            label: "success",
            onClick: () => console.log("success"),
          },
        })
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      add to cart
    </Button>
  );
}
