import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import BasicInfoStep from "./edit-steps/BasicInfoStep";
import HealthBehaviorStep from "./edit-steps/HealthBehaviorStep";
import UpdatePhotoStep from "./edit-steps/UpdatePhotoStep";
import ReviewChangesStep from "./edit-steps/ReviewChangesStep";

export default function EditProfileForm({
  formData,
  handleChange,
  handleFriendlyChange,
  handleSubmit,
  cancelEditing,
  isSubmitting,
  animal,
}) {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [previewImage, setPreviewImage] = useState(animal.image);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        handleChange("image", file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Next step
  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setProgress(progress + 25);
    }
  };

  // Previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 25);
    }
  };

  // Render edit form steps
  const renderEditStep = () => {
    switch (step) {
      case 1:
        return (
          <BasicInfoStep formData={formData} handleChange={handleChange} />
        );
      case 2:
        return (
          <HealthBehaviorStep
            formData={formData}
            handleChange={handleChange}
            handleFriendlyChange={handleFriendlyChange}
          />
        );
      case 3:
        return (
          <UpdatePhotoStep
            previewImage={previewImage}
            handleImageChange={handleImageChange}
          />
        );
      case 4:
        return (
          <ReviewChangesStep formData={formData} previewImage={previewImage} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-[#E29578] text-white">
                Step {step} of 4
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-[#E29578]">
                {progress}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#FFDDD2]">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#E29578]"
            ></motion.div>
          </div>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">{renderEditStep()}</AnimatePresence>

            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
              )}

              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="bg-[#E29578] hover:bg-[#E29578]/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
