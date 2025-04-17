"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Appointment Reminder",
    message: "Your appointment with Dr. Smith is tomorrow at 2 PM.",
    date: "2023-06-25T14:00:00Z",
    read: false,
  },
  {
    id: 2,
    title: "New Message",
    message: "You have a new message from Paws & Claws Grooming.",
    date: "2023-06-24T10:30:00Z",
    read: false,
  },
  {
    id: 3,
    title: "Vaccination Due",
    message:
      "Max is due for his annual vaccinations. Book an appointment soon!",
    date: "2023-06-23T09:15:00Z",
    read: true,
  },
  // Add more notifications as needed
];

export default function Notification() {
  const [userNotifications, setUserNotifications] = useState(notifications);

  const markAsRead = (id) => {
    setUserNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAll = () => {
    setUserNotifications([]);
  };

  return (
    <div className="container  px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            {userNotifications.length === 0 ? (
              <p className="text-center text-10 my-8">No notifications</p>
            ) : (
              <ul className="space-y-4">
                {userNotifications.map((notification) => (
                  <motion.li
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={notification.read ? "bg-gray-50" : "bg-white"}
                    >
                      <CardContent className="flex items-start p-4">
                        <Bell className="h-5 w-5 mt-1 mr-3 text-[#E29578]" />
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="ml-2"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
