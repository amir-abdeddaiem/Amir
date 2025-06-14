"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function ServiceProviderStep3({
  formData,
  handleChange,
  handleSubmit,
  prevStep,
  handleServiceChange,
  servicesList,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Services Provided</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {servicesList.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={formData.services.includes(service.id)}
                    onCheckedChange={() => handleServiceChange(service.id)}
                  />
                  <Label htmlFor={service.id}>{service.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Business Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Tell pet owners about your business and services"
              value={formData.description}
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
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms-provider" required />
              <Label htmlFor="terms-provider" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-[#E29578] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#E29578] hover:underline"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button type="submit" className="bg-[#E29578] hover:bg-[#d88a6d]">
              Create Business Account
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
