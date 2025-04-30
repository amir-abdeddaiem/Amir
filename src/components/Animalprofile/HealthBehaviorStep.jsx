import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function HealthBehaviorStep({
  formData,
  handleChange,
  handleFriendlyChange,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#E29578]">Health & Behavior</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Tell us about your pet's personality, habits, etc."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Health Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vaccinated"
                checked={formData.vaccinated}
                onCheckedChange={(checked) =>
                  handleChange("vaccinated", checked)
                }
              />
              <Label htmlFor="vaccinated">Vaccinated</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="neutered"
                checked={formData.neutered}
                onCheckedChange={(checked) => handleChange("neutered", checked)}
              />
              <Label htmlFor="neutered">Neutered/Spayed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="microchipped"
                checked={formData.microchipped}
                onCheckedChange={(checked) =>
                  handleChange("microchipped", checked)
                }
              />
              <Label htmlFor="microchipped">Microchipped</Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Friendly With</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="children"
                checked={formData.friendly.children}
                onCheckedChange={(checked) =>
                  handleFriendlyChange("children", checked)
                }
              />
              <Label htmlFor="children">Children</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dogs"
                checked={formData.friendly.dogs}
                onCheckedChange={(checked) =>
                  handleFriendlyChange("dogs", checked)
                }
              />
              <Label htmlFor="dogs">Dogs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cats"
                checked={formData.friendly.cats}
                onCheckedChange={(checked) =>
                  handleFriendlyChange("cats", checked)
                }
              />
              <Label htmlFor="cats">Cats</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other"
                checked={formData.friendly.other}
                onCheckedChange={(checked) =>
                  handleFriendlyChange("other", checked)
                }
              />
              <Label htmlFor="other">Other Animals</Label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
