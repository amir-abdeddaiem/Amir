"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
}

interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export function TimeSlots({ slots, selectedTime, onTimeSelect }: TimeSlotsProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available time slots for this date
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {slots.map((slot, index) => (
        <button
            
          key={index}
        //   variant={selectedTime === `${slot.start}-${slot.end}` ? "default" : "outline"}
          className={`h-14 rounded-xl text-sm font-medium transition-all ${
            selectedTime === `${slot.start}-${slot.end}`
              ? "bg-[#83C5BE] hover:bg-[#83C5BE]/90 text-white"
              : "hover:border-[#83C5BE] hover:text-[#83C5BE]"
          }`}
          onClick={() => onTimeSelect(`${slot.start}-${slot.end}`)}
        >
          {slot.start} - {slot.end}
        </button>
      ))}
    </div>
  );
}