"use client";
import { DirectionAwareHover } from "../ui/direction-aware-hover";

export function Pic({ product }) {
  const imageUrl = "/hams.jpg";
  return (
    <div className="h-[40rem] relative  flex items-center justify-center">
      <DirectionAwareHover imageUrl={imageUrl}>
        <p className="font-bold text-xl">{product?.name}</p>
        <p className="font-normal text-sm">{product?.price}</p>
      </DirectionAwareHover>
    </div>
  );
}
