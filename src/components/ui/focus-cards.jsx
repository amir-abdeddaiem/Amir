"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export const Card = React.memo(({ card, index, hovered, setHovered }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-lg relative bg-gray-100 dark:bg-neutral-900 h-60 md:h-96 w-full transition-all duration-300 ease-out",
      "border-4 border-[#006D77] shadow-lg shadow-[#006D77]/30 hover:shadow-[#006D77]/50",
      "group overflow-hidden", // Déplacé ici pour contenir l'image
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}
  >
    {/* Effet rayonnant au survol */}
    <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#006D77]/10 z-10"></div>

    <div className="absolute inset-0 overflow-hidden">
      <img
        src={card.src}
        alt={card.title}
        className="object-cover w-full h-full"
      />
    </div>

    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300 z-20",
        hovered === index ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {card.title}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards({ cards }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
