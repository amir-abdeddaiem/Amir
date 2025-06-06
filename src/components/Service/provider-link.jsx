"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"

export function ProviderLink({ serviceId, className = "" }) {
  return (
    <Link href={`/provider/${serviceId}`} className={className}>
      <Button
        variant="outline"
        size="sm"
        className="transition-all duration-300 hover:scale-105"
        style={{
          border: "2px solid rgba(131, 197, 190, 0.3)",
          color: "#83C5BE",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Settings className="w-4 h-4 mr-2" />
        Provider Dashboard
      </Button>
    </Link>
  )
}
