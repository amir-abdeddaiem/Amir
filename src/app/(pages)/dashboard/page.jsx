"use client";

import { useState, useEffect } from "react";
import {
  Users,
  PawPrint,
  Calendar,
  ShoppingBag,
  Search,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const metrics = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-[#006D77]",
    bgColor: "bg-[#006D77]/10",
  },
  {
    title: "Registered Animals",
    value: "8,392",
    change: "+8%",
    trend: "up",
    icon: PawPrint,
    color: "text-[#83C5BE]",
    bgColor: "bg-[#83C5BE]/10",
  },
  {
    title: "Active Appointments",
    value: "234",
    change: "+23%",
    trend: "up",
    icon: Calendar,
    color: "text-[#E29578]",
    bgColor: "bg-[#E29578]/10",
  },
  {
    title: "Marketplace Items",
    value: "1,567",
    change: "+15%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-[#006D77]",
    bgColor: "bg-[#006D77]/10",
  },
  {
    title: "Lost Pets Reports",
    value: "89",
    change: "-5%",
    trend: "down",
    icon: Search,
    color: "text-[#E29578]",
    bgColor: "bg-[#E29578]/10",
  },
  {
    title: "Found Pets",
    value: "67",
    change: "+18%",
    trend: "up",
    icon: CheckCircle,
    color: "text-[#83C5BE]",
    bgColor: "bg-[#83C5BE]/10",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "user",
    message: "New user registration: Sarah Ben Ali",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "appointment",
    message: "Veterinary appointment scheduled",
    time: "15 minutes ago",
    status: "info",
  },
  {
    id: 3,
    type: "lost",
    message: "Lost pet reported: Golden Retriever in Tunis",
    time: "1 hour ago",
    status: "warning",
  },
  {
    id: 4,
    type: "found",
    message: "Pet found and reunited with owner",
    time: "2 hours ago",
    status: "success",
  },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 bg-[#EDF6F9] min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg shadow-sm"
            >
              <div className="p-6">
                <div className="h-4 bg-[#FFDDD2]/50 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-[#FFDDD2]/50 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-[#EDF6F9] min-h-screen animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#006D77]">Dashboard</h1>
          <p className="text-[#006D77]/70 mt-2 text-lg">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-[#E29578] hover:bg-[#E29578]/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
            Generate Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={metric.title}
            className="animate-card-hover bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#006D77]/70">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-[#006D77] mt-1">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp
                      className={`w-4 h-4 mr-1 ${
                        metric.trend === "up"
                          ? "text-[#83C5BE]"
                          : "text-[#E29578]"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === "up"
                          ? "text-[#83C5BE]"
                          : "text-[#E29578]"
                      }`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-sm text-[#006D77]/50 ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#006D77]">
              Recent Activities
            </h2>
            <p className="text-[#006D77]/70 mb-4">
              Latest platform activities and updates
            </p>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-[#FFDDD2]/20"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "success"
                        ? "bg-[#83C5BE]"
                        : activity.status === "warning"
                        ? "bg-[#E29578]"
                        : "bg-[#006D77]"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-[#006D77]">{activity.message}</p>
                    <p className="text-xs text-[#006D77]/50 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#006D77]">
              Quick Actions
            </h2>
            <p className="text-[#006D77]/70 mb-4">
              Common administrative tasks
            </p>
            <div className="space-y-3">
              <button className="w-full text-left bg-[#FFDDD2]/20 hover:bg-[#FFDDD2]/30 text-[#006D77] font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Add New User
              </button>
              <button className="w-full text-left bg-[#FFDDD2]/20 hover:bg-[#FFDDD2]/30 text-[#006D77] font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                <PawPrint className="w-4 h-4 mr-2" />
                Register Animal
              </button>
              <button className="w-full text-left bg-[#FFDDD2]/20 hover:bg-[#FFDDD2]/30 text-[#006D77] font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </button>
              <button className="w-full text-left bg-[#FFDDD2]/20 hover:bg-[#FFDDD2]/30 text-[#006D77] font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
