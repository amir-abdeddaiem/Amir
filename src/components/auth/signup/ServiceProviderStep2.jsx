"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ServiceProviderStep2({
  formData,
  handleChange,
  nextStep,
  prevStep,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Add validation logic here if needed
          nextStep();
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Business Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Full Address"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" className="bg-[#E29578] hover:bg-[#d88a6d]">
              Continue
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
} 