"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProfilePicture() {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("/farmer.png");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col items-center gap-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div 
        className="relative w-32 h-32 rounded-md overflow-hidden border-2 border-border group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleButtonClick}
      >
        <img 
          src={imagePreview} 
          alt="Profile" 
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            isHovering ? "opacity-70" : "opacity-100"
          )}
        />
        
        <div className={cn(
          "absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200",
          isHovering ? "opacity-100" : "opacity-0"
        )}>
          <Camera className="text-white h-8 w-8" />
        </div>
      </div>
      
      <Button 
        type="button"
        variant="secondary" 
        size="sm"
        className="text-xs flex gap-2 font-medium"
        onClick={handleButtonClick}
      >
        <Camera className="h-3.5 w-3.5" />
        Choose different user picture
      </Button>
    </div>
  );
}