"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Trash2,
  Clock,
  Save,
} from "lucide-react";
import EnhancedCard from "@/components/Service/enhanced-card";
import { ClientOnly } from "@/components/Service/client-only";

export function ProviderCalendar({
  availability,
  onAvailabilityChange,
  serviceName,
}) {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [localAvailability, setLocalAvailability] = useState(
    availability || {}
  );

  useEffect(() => {
    setMounted(true);
    setCurrentMonth(new Date(2024, 11)); // December 2024
  }, []);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!mounted || !currentMonth) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-8 animate-pulse"
            style={{
              background:
                "linear-gradient(135deg, white 0%, rgba(255, 221, 210, 0.1) 100%)",
              border: "2px solid rgba(131, 197, 190, 0.1)",
            }}
          >
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const hasSlots =
        localAvailability[dateString] &&
        localAvailability[dateString].length > 0;
      const slotsCount = localAvailability[dateString]
        ? localAvailability[dateString].length
        : 0;
      const isSelected = selectedDate === dateString;

      days.push({
        day,
        dateString,
        hasSlots,
        slotsCount,
        isSelected,
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const addTimeSlot = () => {
    if (!selectedDate || !newTimeSlot) return;

    const updatedAvailability = { ...localAvailability };
    if (!updatedAvailability[selectedDate]) {
      updatedAvailability[selectedDate] = [];
    }

    if (!updatedAvailability[selectedDate].includes(newTimeSlot)) {
      updatedAvailability[selectedDate] = [
        ...updatedAvailability[selectedDate],
        newTimeSlot,
      ].sort();
      setLocalAvailability(updatedAvailability);
      setNewTimeSlot("");
    }
  };

  const removeTimeSlot = (timeSlot) => {
    if (!selectedDate) return;

    const updatedAvailability = { ...localAvailability };
    if (updatedAvailability[selectedDate]) {
      updatedAvailability[selectedDate] = updatedAvailability[
        selectedDate
      ].filter((slot) => slot !== timeSlot);
      if (updatedAvailability[selectedDate].length === 0) {
        delete updatedAvailability[selectedDate];
      }
      setLocalAvailability(updatedAvailability);
    }
  };

  const saveChanges = () => {
    onAvailabilityChange(localAvailability);
  };

  const generateQuickSlots = () => {
    if (!selectedDate) return;

    const quickSlots = [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ];

    const updatedAvailability = { ...localAvailability };
    updatedAvailability[selectedDate] = quickSlots;
    setLocalAvailability(updatedAvailability);
  };

  const clearDay = () => {
    if (!selectedDate) return;

    const updatedAvailability = { ...localAvailability };
    delete updatedAvailability[selectedDate];
    setLocalAvailability(updatedAvailability);
  };

  const days = getDaysInMonth(currentMonth);
  const selectedDaySlots = selectedDate
    ? localAvailability[selectedDate] || []
    : [];

  const calendarStyles = {
    background:
      "linear-gradient(135deg, white 0%, rgba(255, 221, 210, 0.1) 100%)",
    border: "2px solid rgba(131, 197, 190, 0.1)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  };

  const headerStyles = {
    background:
      "linear-gradient(135deg, rgba(131, 197, 190, 0.1) 0%, rgba(226, 149, 120, 0.1) 100%)",
  };

  return (
    <ClientOnly
      fallback={
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl p-8" style={calendarStyles}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigateMonth(-1)}
                className="hover:bg-[#83C5BE]/10 rounded-xl p-3"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>

              <div
                className="flex items-center gap-3 px-6 py-3 rounded-xl"
                style={headerStyles}
              >
                <Calendar className="w-6 h-6 text-[#E29578]" />
                <h3 className="text-2xl font-bold text-gray-800">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h3>
              </div>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigateMonth(1)}
                className="hover:bg-[#83C5BE]/10 rounded-xl p-3"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-3 mb-6">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-bold text-gray-600 py-3 rounded-lg"
                  style={{ background: "rgba(249, 250, 251, 1)" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-3">
              {days.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDate(day.dateString)}
                      className="w-full h-full relative transition-all duration-300 rounded-xl text-base font-semibold"
                      style={{
                        background: day.isSelected
                          ? "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.8) 100%)"
                          : day.hasSlots
                          ? "linear-gradient(135deg, rgba(131, 197, 190, 0.2) 0%, rgba(131, 197, 190, 0.1) 100%)"
                          : "white",
                        color: day.isSelected ? "white" : "#374151",
                        border: day.isSelected
                          ? "2px solid #E29578"
                          : day.hasSlots
                          ? "2px solid rgba(131, 197, 190, 0.3)"
                          : "2px solid transparent",
                        boxShadow: day.isSelected
                          ? "0 10px 25px -5px rgba(226, 149, 120, 0.4)"
                          : day.hasSlots
                          ? "0 4px 6px -1px rgba(131, 197, 190, 0.2)"
                          : "0 2px 4px rgba(0,0,0,0.1)",
                        transform: day.isSelected ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <span className="relative z-10">{day.day}</span>
                      {day.hasSlots && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <Badge
                            className="text-white text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              background: day.isSelected
                                ? "rgba(255,255,255,0.3)"
                                : "#83C5BE",
                            }}
                          >
                            {day.slotsCount}
                          </Badge>
                        </div>
                      )}
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slot Management */}
        <div className="space-y-6">
          {/* Selected Date Info */}
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
                      background:
                        "linear-gradient(135deg, rgba(131, 197, 190, 0.8) 0%, rgba(131, 197, 190, 0.6) 100%)",
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
                        background:
                          "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.9) 100%)",
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
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
                  {Object.keys(localAvailability).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Time Slots:</span>
                <Badge style={{ background: "#E29578", color: "white" }}>
                  {Object.values(localAvailability).reduce(
                    (total, slots) => total + slots.length,
                    0
                  )}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month:</span>
                <Badge
                  style={{
                    background: "linear-gradient(135deg, #83C5BE, #E29578)",
                    color: "white",
                  }}
                >
                  {
                    Object.keys(localAvailability).filter((date) =>
                      date.startsWith(
                        `${currentMonth.getFullYear()}-${String(
                          currentMonth.getMonth() + 1
                        ).padStart(2, "0")}`
                      )
                    ).length
                  }{" "}
                  days
                </Badge>
              </div>
            </div>
          </EnhancedCard>
        </div>
      </div>
    </ClientOnly>
  );
}
