"use client";
import UpdateUser from "@/components/Profile/UpdateUser";
import React from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PawPrintIcon as Paw } from "lucide-react";
function page() {
  return (
    <div className="min-h-screen bg-[#EDF6F9] py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4">

        <UpdateUser />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
        </motion.div>
      </div>
    </div>
  );
}

export default page;
