import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function BasicInfoStep({ formData, handleChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#E29578]">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Pet Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your pet's name"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Pet Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="bird">Bird</SelectItem>
              <SelectItem value="rabbit">Rabbit</SelectItem>
              <SelectItem value="hamster">Hamster</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            value={formData.breed}
            onChange={(e) => handleChange("breed", e.target.value)}
            placeholder="Enter breed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder="Years"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              placeholder="kg"
            />
          </div>
        </div>

        <div>
          <Label>Gender</Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </motion.div>
  );
}
