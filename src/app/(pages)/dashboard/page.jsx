"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  PawPrint,
  Calendar,
  ShoppingBag,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const metrics = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Registered Animals",
    value: "8,392",
    change: "+8%",
    trend: "up",
    icon: PawPrint,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Active Appointments",
    value: "234",
    change: "+23%",
    trend: "up",
    icon: Calendar,
    color: "text-auxiliary",
    bgColor: "bg-auxiliary/10",
  },
  {
    title: "Marketplace Items",
    value: "1,567",
    change: "+15%",
    trend: "up",
    icon: ShoppingBag,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Lost Pets Reports",
    value: "89",
    change: "-5%",
    trend: "down",
    icon: Search,
    color: "text-auxiliary",
    bgColor: "bg-auxiliary/10",
  },
  {
    title: "Found Pets",
    value: "67",
    change: "+18%",
    trend: "up",
    icon: CheckCircle,
    color: "text-accent",
    bgColor: "bg-accent/10",
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
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-auxiliary dark:text-foreground">
            Dashboard
          </h1>
          <p className="text-auxiliary/70 dark:text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card
            key={metric.title}
            className="animate-card-hover cursor-pointer border-0 shadow-md hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-auxiliary/70 dark:text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-auxiliary dark:text-foreground mt-1">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp
                      className={`w-4 h-4 mr-1 ${
                        metric.trend === "up" ? "text-accent" : "text-primary"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === "up" ? "text-accent" : "text-primary"
                      }`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-sm text-auxiliary/50 dark:text-muted-foreground ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-auxiliary dark:text-foreground">
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest platform activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-surface/50 dark:bg-muted/50"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "warning"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-auxiliary dark:text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-auxiliary/50 dark:text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-auxiliary dark:text-foreground">
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Add New User
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <PawPrint className="w-4 h-4 mr-2" />
              Register Animal
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
