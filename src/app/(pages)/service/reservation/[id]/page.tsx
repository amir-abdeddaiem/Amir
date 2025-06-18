"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, PawPrint, Bird, Rabbit, Cat, Dog } from "lucide-react";
import { toast } from "sonner";
import BookingModal from "@/components/Service/BookingModal";

interface AvailabilityDay {
  date: string;
  allTimeSlots: string[];
  bookedTimeSlots: string[];
  availableTimeSlots: string[];
  isAvailable: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    providerId: string;
    availability: AvailabilityDay[];
  };
}

interface SelectedSlot {
  date: string;
  time: string;
}

const groupByWeeks = (availability: AvailabilityDay[]) => {
  const weeks: { [key: number]: AvailabilityDay[] } = {};
  availability.forEach((day) => {
    const date = new Date(day.date);
    const weekNumber = Math.ceil(date.getDate() / 7);
    if (!weeks[weekNumber]) {
      weeks[weekNumber] = [];
    }
    weeks[weekNumber].push(day);
  });
  return weeks;
};

const animalIcons = [PawPrint, Bird, Rabbit, Cat, Dog];
const getRandomAnimalIcon = () => {
  return animalIcons[Math.floor(Math.random() * animalIcons.length)];
};

const CalendarView: React.FC = () => {
  const { id } = useParams();
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `/api/services/availability/${id}`
        );
        if (res.data.success) {
          setAvailability(res.data.data.availability);
        } else {
          setError("Failed to load availability");
        }
      } catch (err) {
        setError("Server error while fetching availability");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAvailability();
  }, [id]);

  const handleDayClick = (date: string) => {
    setSelectedDay(date);
  };

  const handleSlotClick = (date: string, time: string) => {
    setSelectedSlot({ date, time });
    setIsModalOpen(true);
    toast.info(`Selected ${time} on ${new Date(date).toLocaleDateString()}`, {
      description: "Complete the booking form to schedule your appointment.",
      icon: <PawPrint className="w-5 h-5 text-amber-600" />,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  if (loading) {
    const AnimalIcon = getRandomAnimalIcon();
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-4">
          <div className="relative">
            <AnimalIcon className="h-16 w-16 text-amber-600 animate-bounce" />
            <div className="absolute -inset-2 bg-amber-100 rounded-full opacity-60 -z-10 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              Fetching available slots...
            </p>
            <p className="text-sm text-gray-500">
              Our furry friends are preparing your schedule
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <div className="relative inline-block mb-4">
            <Cat className="h-12 w-12 text-red-500" />
            <Dog className="h-12 w-12 text-red-500 absolute top-0 left-0 opacity-0 animate-alternate-pets" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <PawPrint className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const weeks = groupByWeeks(availability);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-amber-100">
        {/* Header with animal pattern */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => {
              const Icon = animalIcons[i % animalIcons.length];
              return (
                <Icon
                  key={i}
                  className="absolute text-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `scale(${0.5 + Math.random()}) rotate(${Math.random() * 360}deg)`,
                  }}
                  size={24}
                />
              );
            })}
          </div>
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <PawPrint className="h-8 w-8" />
              Pet Care Appointments
              <PawPrint className="h-8 w-8" />
            </h1>
            <p className="text-amber-100 text-lg">
              Book a time to pamper your furry friend
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Calendar navigation */}
          <div className="flex justify-between items-center mb-6">
            <button className="p-2 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button className="p-2 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-amber-700 text-sm"
              >
                {day}
              </div>
            ))}
            {Object.entries(weeks).map(([weekIndex, week]) => (
              <React.Fragment key={weekIndex}>
                {week.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => handleDayClick(day.date)}
                    className={`p-2 rounded-lg hover:bg-amber-100 transition-all ${
                      selectedDay === day.date
                        ? "bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-md"
                        : day.isAvailable
                        ? "bg-amber-50 text-amber-800"
                        : "bg-gray-100 text-gray-400"
                    } ${
                      new Date(day.date).toDateString() ===
                      new Date().toDateString()
                        ? "ring-2 ring-amber-400"
                        : ""
                    }`}
                    disabled={!day.isAvailable}
                  >
                    <div className="flex flex-col items-center">
                      <div className="font-semibold text-sm">
                        {new Date(day.date).getDate()}
                      </div>
                      {day.isAvailable && (
                        <div className="mt-1">
                          <PawPrint className="h-3 w-3 text-amber-500" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </React.Fragment>
            ))}
          </div>

          {selectedDay && (
            <div className="mt-8 border-t border-amber-100 pt-6">
              <h3 className="text-xl font-semibold text-center mb-4 text-amber-900 flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Available Times on{" "}
                {new Date(selectedDay).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {availability
                  .find((day) => day.date === selectedDay)
                  ?.availableTimeSlots.map((slot) => {
                    const Icon = getRandomAnimalIcon();
                    return (
                      <Badge
                        key={slot}
                        className="cursor-pointer bg-gradient-to-r from-amber-400 to-orange-400 text-white hover:from-amber-500 hover:to-orange-500 transition-all duration-200 justify-center py-3 px-5 text-sm font-medium rounded-lg hover:shadow-lg flex items-center gap-2"
                        onClick={() => handleSlotClick(selectedDay, slot)}
                        variant={undefined}
                      >
                        <Icon className="h-4 w-4" />
                        {slot}
                      </Badge>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedSlot && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedDate={selectedSlot.date}
          selectedTime={selectedSlot.time}
          providerId={id as string}
        />
      )}
    </div>
  );
};

export default CalendarView;