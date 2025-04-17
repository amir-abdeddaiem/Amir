"use client";
import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

// Import Popups
import LeftPopup from "./LeftPopup";
import RightPopup from "./RightPopup";
import CenterPopup from "./CenterPopup";

export default function Searchbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="relative w-full max-w-xl transition-all ease-in-out ">
      {/* Dialog Component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div layout className="relative flex items-center">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border-2 border-[#83C5BE] focus:border-[#E29578] focus:outline-none"
            />
          </motion.div>
        </DialogTrigger>

        <DialogContent className="bg-white border border-[#83C5BE] p-4 overflow-hidden shadow-xl rounded-lg relative">
          <DialogTitle>Search</DialogTitle>
          <Command className="w-full max-w-lg bg-white text-gray-700 rounded-lg">
            <CommandInput
              className="text-gray-700 bg-transparent border-b border-[#83C5BE] px-4 py-3 focus:outline-none focus:border-[#E29578] transition-all"
              placeholder="Type a command or search..."
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty className="p-4 text-center text-gray-500">
                No results found.
              </CommandEmpty>
              <CommandGroup heading="Follow for updates" className="px-4 py-2">
                {[
                  "Twitter @mannupaaji",
                  "GitHub @mannupaaji",
                  "LinkedIn @mannupaaji",
                ].map((item, index) => (
                  <CommandItem
                    key={index}
                    className="px-4 py-2 text-gray-700 cursor-pointer rounded-md transition-all hover:bg-[#EDF6F9] hover:text-[#E29578] focus:bg-[#EDF6F9] focus:text-[#E29578]"
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Show Popups only if dialog is open */}
      {isDialogOpen && (
        <>
          <LeftPopup onClose={() => setIsDialogOpen(false)} />
          <RightPopup onClose={() => setIsDialogOpen(false)} />
        </>
      )}
    </div>
  );
}
