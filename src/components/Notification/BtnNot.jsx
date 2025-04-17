import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Notification from "./Notification";
import { Bell } from "lucide-react";

export function BtnNot() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-[#E29578]" />
        </Button>
        {/* <Button variant="outline">Open</Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Notification />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
