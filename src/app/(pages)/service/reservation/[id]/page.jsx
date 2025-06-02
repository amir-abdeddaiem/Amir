"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomCalendar } from "@/components/Service/custom-calendar";
import { TimeSlots } from "@/components/Service/time-slots";
import EnhancedCard from "@/components/Service/enhanced-card";
import AnimatedBackground from "@/components/Service/animated-background";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { services } from "@/lib/mock-data";
// import { useToast } from "@/hooks/use-toast"
import Link from "next/link";

export default function ReservationPage() {
  const params = useParams();
  const router = useRouter();
  // const { toast } = useToast()
  const serviceId = Number.parseInt(params.id);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [petName, setPetName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = services.find((s) => s.id === serviceId);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !service?.availability) return [];
    return service.availability[selectedDate] || [];
  }, [selectedDate, service]);

  if (!service) {
    return (
      <AnimatedBackground className="min-h-screen flex items-center justify-center">
        <EnhancedCard className="text-center max-w-md mx-4" gradient>
          <div className="text-6xl mb-6">😿</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Service not found
          </h2>
          <p className="text-gray-500 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#E29578] to-[#E29578]/90 hover:from-[#E29578]/90 hover:to-[#E29578] text-white border-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </EnhancedCard>
      </AnimatedBackground>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!petName.trim()) {
    //   toast({
    //     title: "Pet name required! 🐾",
    //     description: "Please enter your pet's name",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!selectedDate) {
    //   toast({
    //     title: "Date required! 📅",
    //     description: "Please select a date for your appointment",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // if (!selectedTime) {
    //   toast({
    //     title: "Time required! ⏰",
    //     description: "Please select a time slot",
    //     variant: "destructive",
    //   })
    //   return
    // }

    // setIsSubmitting(true)

    // // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    // toast({
    //   title: "Reservation confirmed! 🎉",
    //   description: `${petName}'s appointment is booked for ${selectedDate} at ${selectedTime}`,
    // })

    setIsSubmitting(false);

    // Reset form
    setPetName("");
    setSelectedDate("");
    setSelectedTime("");
    setMessage("");
  };

  const getServiceEmoji = (type) => {
    switch (type) {
      case "Veterinary":
        return "🏥";
      case "Grooming":
        return "✂️";
      case "Training":
        return "🎾";
      case "Pet Sitting":
        return "🏠";
      default:
        return "🐾";
    }
  };

  const isFormComplete = petName && selectedDate && selectedTime;

  return (
    <AnimatedBackground className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-0">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="lg"
                className="hover:bg-[#83C5BE]/10 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Button>
            </Link>
            <Separator
              orientation="vertical"
              className="h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent"
            />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#83C5BE] to-[#E29578] rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Book Appointment
                </h1>
                <p className="text-sm text-gray-500">
                  Reserve your pet's perfect service
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#E29578] animate-pulse" />
            <span className="text-sm font-medium text-gray-600">
              Step-by-step booking
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Service Info - Enhanced */}
          <div className="xl:col-span-4">
            <div className="sticky top-8 space-y-6">
              <EnhancedCard className="overflow-hidden" gradient>
                <div className="relative">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-[#83C5BE] to-[#E29578] text-white border-0 shadow-lg px-3 py-1.5">
                      {getServiceEmoji(service.type)} {service.type}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {service.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>

                  <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">
                          {service.rating}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="font-bold text-lg">
                          {service.distance}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Distance</p>
                    </div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-[#E29578]/10 to-[#83C5BE]/10 rounded-xl border border-[#E29578]/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-6 h-6 text-[#E29578]" />
                      <span className="font-bold text-2xl text-[#E29578]">
                        {service.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Service Price</p>
                  </div>
                </div>
              </EnhancedCard>

              {/* Progress Indicator */}
              <EnhancedCard title="Booking Progress" icon="📋">
                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      petName
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        petName ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        petName ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      Pet Information
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      selectedDate
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        selectedDate ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        selectedDate ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      Date Selection
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      selectedTime
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        selectedTime ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        selectedTime ? "text-green-700" : "text-gray-500"
                      }`}
                    >
                      Time Selection
                    </span>
                  </div>
                </div>
              </EnhancedCard>
            </div>
          </div>

          {/* Booking Form - Enhanced */}
          <div className="xl:col-span-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Pet Information */}
              <EnhancedCard title="Pet Information" icon="🐕" gradient>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="petName"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
                    >
                      <User className="w-4 h-4 text-[#83C5BE]" />
                      Pet's Name *
                    </label>
                    <Input
                      id="petName"
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="Enter your pet's name... 🐾"
                      className="h-12 border-2 border-[#83C5BE]/20 focus:border-[#E29578] rounded-xl text-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="message"
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
                    >
                      <MessageSquare className="w-4 h-4 text-[#83C5BE]" />
                      Special Instructions (Optional)
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Any special needs or instructions for your pet..."
                      className="border-2 border-[#83C5BE]/20 focus:border-[#E29578] rounded-xl min-h-[120px] resize-none"
                    />
                  </div>
                </div>
              </EnhancedCard>

              {/* Date Selection */}
              <EnhancedCard title="Select Date" icon="📅" gradient>
                <CustomCalendar
                  availability={service.availability}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </EnhancedCard>

              {/* Time Selection */}
              {selectedDate && (
                <EnhancedCard title="Select Time" icon="⏰" gradient>
                  <TimeSlots
                    slots={availableTimeSlots}
                    selectedTime={selectedTime}
                    onTimeSelect={setSelectedTime}
                  />
                </EnhancedCard>
              )}

              {/* Booking Summary */}
              {isFormComplete && (
                <EnhancedCard
                  title="Booking Summary"
                  icon="📋"
                  className="bg-gradient-to-br from-[#83C5BE]/5 via-white to-[#E29578]/5 border-2 border-[#E29578]/20 shadow-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl">
                        <span className="text-gray-600 font-medium">Pet:</span>
                        <span className="font-bold text-lg">{petName} 🐾</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl">
                        <span className="text-gray-600 font-medium">
                          Service:
                        </span>
                        <span className="font-bold">{service.name}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl">
                        <span className="text-gray-600 font-medium">Date:</span>
                        <span className="font-bold">{selectedDate}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/80 rounded-xl">
                        <span className="text-gray-600 font-medium">Time:</span>
                        <span className="font-bold">{selectedTime}</span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Separator className="bg-gradient-to-r from-transparent via-[#E29578]/30 to-transparent my-4" />
                      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#E29578]/10 to-[#83C5BE]/10 rounded-xl">
                        <span className="text-xl font-bold text-gray-800">
                          Total:
                        </span>
                        <span className="text-3xl font-bold text-[#E29578]">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </EnhancedCard>
              )}

              {/* Submit Button */}
              <div className="sticky bottom-8 z-20">
                <Button
                  type="submit"
                  disabled={!isFormComplete || isSubmitting}
                  className="w-full bg-gradient-to-r from-[#E29578] to-[#83C5BE] hover:from-[#E29578]/90 hover:to-[#83C5BE]/90 text-white py-4 text-xl font-bold transition-all duration-500 hover:shadow-2xl disabled:opacity-50 rounded-2xl border-0 shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Booking your appointment...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="animate-bounce text-2xl">🎉</span>
                      <span>Confirm Booking</span>
                      <span className="animate-bounce text-2xl">🐾</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
}
