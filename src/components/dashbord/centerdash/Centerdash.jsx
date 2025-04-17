"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, Calendar } from "lucide-react";

export default function Centerdash() {
  const [activeTab, setActiveTab] = useState("staff");

  const staffManagement = (
    <Card>
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add staff management content here */}
        <p>Staff management features will be displayed here.</p>
      </CardContent>
    </Card>
  );

  const serviceManagement = (
    <Card>
      <CardHeader>
        <CardTitle>Service Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add service management content here */}
        <p>Service management features will be displayed here.</p>
      </CardContent>
    </Card>
  );

  const appointmentManagement = (
    <Card>
      <CardHeader>
        <CardTitle>Appointment Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add appointment management content here */}
        <p>Appointment management features will be displayed here.</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Center Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="staff"
              className="flex items-center justify-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Staff
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex items-center justify-center"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Appointments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="staff">{staffManagement}</TabsContent>
          <TabsContent value="services">{serviceManagement}</TabsContent>
          <TabsContent value="appointments">
            {appointmentManagement}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
