import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ReviewChangesStep({ formData, previewImage }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#E29578]">Review Changes</h2>
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-medium text-gray-500">Pet Name</Label>
                <p>{formData.name || "Not provided"}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Pet Type</Label>
                <p>{formData.type || "Not provided"}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Breed</Label>
                <p>{formData.breed || "Not provided"}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Age</Label>
                <p>{formData.age || "Not provided"}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Gender</Label>
                <p>{formData.gender || "Not provided"}</p>
              </div>
              <div>
                <Label className="font-medium text-gray-500">Weight</Label>
                <p>
                  {formData.weight
                    ? `${formData.weight} kg`
                    : "Not provided"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <Label className="font-medium text-gray-500">Description</Label>
              <p>{formData.description || "Not provided"}</p>
            </div>

            <div className="mt-4">
              <Label className="font-medium text-gray-500">Health Status</Label>
              <ul className="list-disc list-inside">
                <li
                  className={
                    formData.vaccinated ? "text-green-600" : "text-gray-400"
                  }
                >
                  {formData.vaccinated ? "Vaccinated" : "Not vaccinated"}
                </li>
                <li
                  className={
                    formData.neutered ? "text-green-600" : "text-gray-400"
                  }
                >
                  {formData.neutered
                    ? "Neutered/Spayed"
                    : "Not neutered/spayed"}
                </li>
                <li
                  className={
                    formData.microchipped ? "text-green-600" : "text-gray-400"
                  }
                >
                  {formData.microchipped
                    ? "Microchipped"
                    : "Not microchipped"}
                </li>
              </ul>
            </div>

            <