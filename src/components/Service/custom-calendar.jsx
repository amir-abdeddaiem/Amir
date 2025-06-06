"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { ClientOnly } from "@/components/Service/client-only";

export function CustomCalendar({ availability, onDateSelect, selectedDate }) {
  const [mounted, setMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(null);

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
      const isAvailable =
        availability &&
        availability[dateString] &&
        availability[dateString].length > 0;
      const isSelected = selectedDate === dateString;
      const slotsCount =
        availability && availability[dateString]
          ? availability[dateString].length
          : 0;

      days.push({
        day,
        dateString,
        isAvailable,
        isSelected,
        slotsCount,
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

  const days = getDaysInMonth(currentMonth);

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
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
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
                  disabled={!day.isAvailable}
                  onClick={() =>
                    day.isAvailable && onDateSelect(day.dateString)
                  }
                  className="w-full h-full relative transition-all duration-300 rounded-xl text-base font-semibold"
                  style={{
                    background: day.isSelected
                      ? "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.8) 100%)"
                      : day.isAvailable
                      ? "white"
                      : "rgba(249, 250, 251, 1)",
                    color: day.isSelected
                      ? "white"
                      : day.isAvailable
                      ? "#374151"
                      : "#D1D5DB",
                    border: day.isSelected
                      ? "2px solid #E29578"
                      : day.isAvailable
                      ? "2px solid transparent"
                      : "none",
                    boxShadow: day.isSelected
                      ? "0 10px 25px -5px rgba(226, 149, 120, 0.4)"
                      : day.isAvailable
                      ? "0 2px 4px rgba(0,0,0,0.1)"
                      : "none",
                    transform: day.isSelected ? "scale(1.05)" : "scale(1)",
                    cursor: day.isAvailable ? "pointer" : "not-allowed",
                  }}
                >
                  <span className="relative z-10">{day.day}</span>
                  {day.isAvailable && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <Badge
                        className="text-white text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: "#83C5BE" }}
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

        {/* Legend */}
        <div
          className="flex items-center justify-center gap-6 mt-8 p-4 rounded-xl"
          style={{
            background:
              "linear-gradient(to right, rgba(249, 250, 251, 1) 0%, rgba(243, 244, 246, 1) 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                background:
                  "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.8) 100%)",
              }}
            />
            <span className="text-sm font-medium text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 bg-white rounded"
              style={{ border: "2px solid rgba(131, 197, 190, 0.3)" }}
            />
            <span className="text-sm font-medium text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ background: "rgba(229, 231, 235, 1)" }}
            />
            <span className="text-sm font-medium text-gray-600">
              Unavailable
            </span>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
