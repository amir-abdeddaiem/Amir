import { Search } from "lucide-react"
import { PopoverContent } from "@/components/ui/popover"

export function CenterPopup() {
  return (
    <PopoverContent className="w-80 p-4" align="center" sideOffset={20}>
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Center Popup</h3>
        <p className="text-sm text-muted-foreground">This popup appears in the center below the search bar.</p>
        <div className="grid gap-2">
          <div className="flex items-center gap-2 rounded-md bg-muted p-3">
            <Search className="h-4 w-4" />
            <span className="text-sm">Popular search 1</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted p-3">
            <Search className="h-4 w-4" />
            <span className="text-sm">Popular search 2</span>
          </div>
        </div>
      </div>
    </PopoverContent>
  )
}

