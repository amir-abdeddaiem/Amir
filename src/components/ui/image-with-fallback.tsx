"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, User, Package } from "lucide-react"

interface ImageWithFallbackProps {
    src?: string
    alt: string
    width?: number
    height?: number
    className?: string
    fallbackType?: "pet" | "user" | "product"
}

export function ImageWithFallback({
    src,
    alt,
    width = 200,
    height = 200,
    className = "",
    fallbackType = "pet",
}: ImageWithFallbackProps) {
    const [imageError, setImageError] = useState(false)

    const getFallbackIcon = () => {
        switch (fallbackType) {
            case "user":
                return <User className="w-12 h-12 text-gray-400" />
            case "product":
                return <Package className="w-12 h-12 text-gray-400" />
            default:
                return <Heart className="w-12 h-12 text-gray-400" />
        }
    }

    if (!src || imageError) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ width, height }}>
                {getFallbackIcon()}
            </div>
        )
    }

    return (
        <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className={className}
            onError={() => setImageError(true)}
            loading="lazy"
        />
    )
}
