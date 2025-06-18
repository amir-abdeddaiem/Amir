"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Clock,
  Save,
} from "lucide-react";
import EnhancedCard from "@/components/Service/enhanced-card";
import { ClientOnly } from "@/components/Service/client-only";

export function ProviderCalendar({
  availability = [],
  onAvailabilityChange,
  serviceName = "Service",
}) {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [localAvailability, setLocalAvailability] = useState([]);

  useEffect(() => {
    setMounted(true);
    setCurrentMonth(new Date(2024, 11)); // December 2024
  }, []);

  // Initialize local availability when props change
  useEffect(() => {
    if (Array.isArray(availability)) {
      setLocalAvailability(availability);
    } else {
      setLocalAvailability([]);
    }
  }, [availability]);

  // Convert availability array to object for easier manipulation
  const availabilityObj = useMemo(() => {
    return localAvailability.reduce((acc, item) => {
      if (item?.date && Array.isArray(item.time)) {
        acc[item.date] = item.time;
      }
      return acc;
    }, {});
  }, [localAvailability]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      if (!prev) return new Date();
      return new Date(prev.getFullYear(), prev.getMonth() + direction);
    });
  };

  const getDaysInMonth = (date) => {
    if (!date) return Array(35).fill(null);
    
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();

    const days = Array(startingDayOfWeek).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasSlots = availabilityObj[dateString] && availabilityObj[dateString].length > 0;
      const slotsCount = availabilityObj[dateString]?.length || 0;
      const isSelected = selectedDate === dateString;

      days.push({ day, dateString, hasSlots, slotsCount, isSelected });
    }

    return days;
  };

  const addTimeSlot = () => {
    if (!selectedDate || !newTimeSlot) return;

    setLocalAvailability(prev => {
      const existingIndex = prev.findIndex(item => item.date === selectedDate);
      
      if (existingIndex >= 0) {
        // Date exists, add time if not already present
        const updated = [...prev];
        if (!updated[existingIndex].time.includes(newTimeSlot)) {
          updated[existingIndex] = {
            date: selectedDate,
            time: [...updated[existingIndex].time, newTimeSlot].sort()
          };
          return updated;
        }
        return prev;
      } else {
        // New date
        return [...prev, { date: selectedDate, time: [newTimeSlot] }];
      }
    });

    setNewTimeSlot("");
  };

  const removeTimeSlot = (timeSlot) => {
    if (!selectedDate) return;

    setLocalAvailability(prev => {
      const existingIndex = prev.findIndex(item => item.date === selectedDate);
      if (existingIndex >= 0) {
        const updatedTime = prev[existingIndex].time.filter(t => t !== timeSlot);
        
        if (updatedTime.length === 0) {
          // Remove date entry if no more time slots
          return prev.filter(item => item.date !== selectedDate);
        } else {
          // Update time slots
          const updated = [...prev];
          updated[existingIndex] = { date: selectedDate, time: updatedTime };
          return updated;
        }
      }
      return prev;
    });
  };

  const saveChanges = () => {
    const formattedData = localAvailability.map(item => ({
      date: item.date,
      time: item.time
    }));
    
    onAvailabilityChange(formattedData);
  };

  const generateQuickSlots = () => {
    if (!selectedDate) return;

    const quickSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
      "16:00", "16:30", "17:00", "17:30"
    ];

    setLocalAvailability(prev => {
      const existingIndex = prev.findIndex(item => item.date === selectedDate);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { date: selectedDate, time: quickSlots };
        return updated;
      } else {
        return [...prev, { date: selectedDate, time: quickSlots }];
      }
    });
  };

  const clearDay = () => {
    if (!selectedDate) return;
    setLocalAvailability(prev => prev.filter(item => item.date !== selectedDate));
  };

  const days = getDaysInMonth(currentMonth);
  const selectedDaySlots = selectedDate ? (availabilityObj[selectedDate] || []) : [];

  if (!mounted || !currentMonth) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-2xl p-8 animate-pulse" style={{
            background: "linear-gradient(135deg, white 0%, rgba(255, 221, 210, 0.1) 100%)",
            border: "2px solid rgba(131, 197, 190, 0.1)",
          }}>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly fallback={<div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <EnhancedCard
            title={`${serviceName} Availability - ${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
            icon="📅"
            gradient
          >
            <div className="space-y-4">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={() => navigateMonth(-1)}
                  variant="ghost"
                  size="sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </Button>
                <h3 className="text-lg font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <Button
                  onClick={() => navigateMonth(1)}
                  variant="ghost"
                  size="sm"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1">
                {daysOfWeek.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day ? (
                      <button
                        onClick={() => setSelectedDate(day.dateString)}
                        className={`w-full h-full rounded-lg flex flex-col items-center justify-center transition-all
                          ${day.isSelected ? "bg-[#83C5BE] text-white" : 
                            day.hasSlots ? "bg-[#E29578]/10 hover:bg-[#E29578]/20" : 
                            "bg-gray-50 hover:bg-gray-100"}
                          ${day.day === new Date().getDate() && 
                            currentMonth.getMonth() === new Date().getMonth() && 
                            currentMonth.getFullYear() === new Date().getFullYear() ?
                            "border-2 border-[#83C5BE]" : ""}
                        `}
                      >
                        <span className="text-sm font-medium">{day.day}</span>
                        {day.hasSlots && (
                          <span className={`text-xs mt-1 px-1 rounded-full 
                            ${day.isSelected ? "bg-white/20" : "bg-[#E29578]/20 text-[#E29578]"}`}>
                            {day.slotsCount} slot{day.slotsCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="w-full h-full bg-transparent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* Time Slot Management */}
        <div className="space-y-6">
          <EnhancedCard
            title={selectedDate ? `Manage ${selectedDate}` : "Select a Date"}
            icon="⏰"
            gradient
          >
            {selectedDate ? (
              <div className="space-y-4">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={generateQuickSlots}
                    className="text-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(131, 197, 190, 0.8) 0%, rgba(131, 197, 190, 0.6) 100%)",
                      color: "white",
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Quick Fill
                  </Button>
                  <Button
                    onClick={clearDay}
                    variant="outline"
                    className="text-sm border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Day
                  </Button>
                </div>

                {/* Add Time Slot */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Add Time Slot
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={addTimeSlot}
                      size="sm"
                      style={{
                        background: "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.9) 100%)",
                        color: "white",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Current Time Slots */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Current Slots ({selectedDaySlots.length})
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedDaySlots.length > 0 ? (
                      selectedDaySlots.map((slot) => (
                        <div
                          key={slot}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{ background: "rgba(249, 250, 251, 1)" }}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#83C5BE]" />
                            <span className="font-medium">{slot}</span>
                          </div>
                          <Button
                            onClick={() => removeTimeSlot(slot)}
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">
                        No time slots for this date
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  Select a date to manage time slots
                </p>
              </div>
            )}
          </EnhancedCard>

          {/* Save Changes */}
          <Button
            onClick={saveChanges}
            className="w-full py-3 text-lg font-semibold"
            style={{
              background: "linear-gradient(135deg, #E29578 0%, #83C5BE 100%)",
              color: "white",
            }}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </Button>

          {/* Statistics */}
          <EnhancedCard title="Availability Stats" icon="📊">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Available Days:</span>
                <Badge style={{ background: "#83C5BE", color: "white" }}>
                  {localAvailability.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Time Slots:</span>
                <Badge style={{ background: "#E29578", color: "white" }}>
                  {localAvailability.reduce((total, item) => total + item.time.length, 0)}
                </Badge>
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </ClientOnly>
  );
}