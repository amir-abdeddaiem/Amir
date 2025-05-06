"use client";
import UpdateUser from "@/components/Profile/UpdateUser";
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PawPrintIcon as Paw } from "lucide-react";
import Signout from "@/components/Signout/Signout";
// Assuming Signin modal logic is handled correctly

function page() {
  const profileId = "68179fc6d6940f9cc667a5cf"; // This should be dynamic based on the logged-in user
  return (
    <div className="min-h-screen bg-[#EDF6F9] py-12 flex items-center justify-center">
      {/* Simplified outer div assuming AuthLayout might handle background/pattern */}
      <div className="max-w-4xl w-full mx-auto px-4">
        {/* Removed redundant Back to Home link if AuthLayout has navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-[#E29578] text-white rounded-t-lg p-6">
              <div className="flex items-center gap-3">
                <Paw size={28} />
                <div>
                  <CardTitle className="text-2xl font-semibold">
                    Join Animal's Club
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Create your account to connect with pet lovers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 px-6">
              <UpdateUser params={{ id: profileId }} />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50 p-6">
              <div className="text-center text-sm text-gray-600 w-full">
                <Signout />
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>

    // <div>
    //   <UpdateUser />
    // </div>
  );
}

export default page;
