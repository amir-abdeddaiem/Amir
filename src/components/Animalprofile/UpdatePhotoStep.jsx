import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Upload, Camera } from "lucide-react";

export default function UpdatePhotoStep({ previewImage, handleImageChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#E29578]">Update Photo</h2>
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full h-64 mb-4 bg-gray-100 rounded-lg overflow-hidden">
            {previewImage ? (
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Camera className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No image selected</p>
              </div>
            )}
          </div>

          <Label
            htmlFor="image-upload"
            className="flex items-center justify-center px-4 py-2 bg-[#83C5BE] text-white rounded-md cursor-pointer hover:bg-[#83C5BE]/90 transition-colors"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose New Image
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </Label>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Upload a clear photo of your pet.</p>
          <p>Maximum file size: 5MB</p>
        </div>
      </div>
    </motion.div>
  );
}
