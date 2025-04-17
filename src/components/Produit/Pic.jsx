"use client";
import { DirectionAwareHover } from "../ui/direction-aware-hover";

export function Pic() {
  const imageUrl = "/hams.jpg";
  return (
    <div className="h-[40rem] relative  flex items-center justify-center">
      <DirectionAwareHover imageUrl={imageUrl}>
        <p className="font-bold text-xl">Hamster</p>
        <p className="font-normal text-sm">$1299 / night</p>
      </DirectionAwareHover>
    </div>
  );
}
