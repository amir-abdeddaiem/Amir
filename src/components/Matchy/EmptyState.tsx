"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-[600px] text-center p-8">
            <div className="text-8xl mb-4 animate-bounce">😴</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No more pets here!</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
                You've seen all the adorable pets in your area. Check back later for new furry friends!
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => window.location.reload()} variant={undefined} size={undefined}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
            </Button>
        </div>
    )
}
