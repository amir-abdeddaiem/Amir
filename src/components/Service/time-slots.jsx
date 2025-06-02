"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap } from "lucide-react";

export function TimeSlots({ slots, selectedTime, onTimeSelect }) {
  if (!slots || slots.length === 0) {
    return (
      <div
        className="text-center py-12 rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(249, 250, 251, 1) 0%, rgba(243, 244, 246, 1) 100%)",
        }}
      >
        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No time slots available
        </h3>
        <p className="text-gray-500">Please select a different date</p>
      </div>
    );
  }

  const getTimeOfDay = (time) => {
    const hour = Number.parseInt(time.split(":")[0]);
    if (hour < 12)
      return {
        label: "Morning",
        gradient:
          "linear-gradient(135deg, rgba(254, 243, 199, 1) 0%, rgba(253, 230, 138, 1) 100%)",
        icon: "🌅",
      };
    if (hour < 17)
      return {
        label: "Afternoon",
        gradient:
          "linear-gradient(135deg, rgba(255, 237, 213, 1) 0%, rgba(254, 215, 170, 1) 100%)",
        icon: "☀️",
      };
    return {
      label: "Evening",
      gradient:
        "linear-gradient(135deg, rgba(243, 232, 255, 1) 0%, rgba(221, 214, 254, 1) 100%)",
      icon: "🌙",
    };
  };

  const groupedSlots = slots.reduce((acc, time) => {
    const timeOfDay = getTimeOfDay(time);
    if (!acc[timeOfDay.label]) {
      acc[timeOfDay.label] = { ...timeOfDay, slots: [] };
    }
    acc[timeOfDay.label].slots.push(time);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #83C5BE 0%, #E29578 100%)",
          }}
        >
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Available Times</h3>
          <p className="text-sm text-gray-500">
            Choose your preferred time slot
          </p>
        </div>
        <Badge
          className="ml-auto text-white"
          style={{
            background: "linear-gradient(135deg, #83C5BE 0%, #E29578 100%)",
          }}
        >
          <Zap className="w-3 h-3 mr-1" />
          {slots.length} slots
        </Badge>
      </div>

      {Object.entries(groupedSlots).map(([period, data]) => (
        <div
          key={period}
          className="p-6 rounded-2xl"
          style={{
            background: data.gradient,
            border: "1px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{data.icon}</span>
            <h4 className="text-lg font-bold text-gray-700">{period}</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.slots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => onTimeSelect(time)}
                className="transition-all duration-300 hover:scale-105 h-14 text-base font-semibold rounded-xl"
                style={{
                  background:
                    selectedTime === time
                      ? "linear-gradient(135deg, #E29578 0%, rgba(226, 149, 120, 0.9) 100%)"
                      : "rgba(255, 255, 255, 0.8)",
                  color: selectedTime === time ? "white" : "#374151",
                  border: selectedTime === time ? "none" : "2px solid white",
                  boxShadow:
                    selectedTime === time
                      ? "0 10px 25px -5px rgba(226, 149, 120, 0.4)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                {time}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
