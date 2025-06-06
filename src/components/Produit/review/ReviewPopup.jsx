"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRefresh } from "@/contexts/RefreshContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { useUserData } from "@/contexts/UserData";

export function ReviewPopup({ productId }) {
  const { userData } = useUserData();
  const userId = userData.id;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const { triggerRefresh } = useRefresh();

  // Log userId for debugging
  useEffect(() => {
    console.log("ReviewPopup userId:", userId);
  }, [userId]);

  // Fetch existing review
  useEffect(() => {
    if (userId && productId) {
      console.log("Fetching review with:", { productId, userId });
      fetch(`/api/review?productId=${productId}&userId=${userId}`, {
        credentials: "include",
      })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            console.error("Failed to fetch review:", response.status, text);
            throw new Error(`Failed to fetch review: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.review) {
            setExistingReview(data.review);
            setRating(data.review.stars);
            setReviewText(data.review.message);
            if (data.review.photo) {
              setPreviewUrl(data.review.photo);
            }
          } else {
            setExistingReview(null);
            setRating(0);
            setReviewText("");
            setPreviewUrl(null);
          }
        })
        .catch((err) => console.error("Failed to fetch review:", err));
    }
  }, [userId, productId]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PNG, JPG, or JPEG image");
        return;
      }
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please enter a review message");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("stars", rating.toString());
      formData.append("message", reviewText);
      formData.append("product", productId);

      // Convert photo to base64 if it exists
      if (photo) {
        const reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onloadend = async () => {
          const base64String = reader.result;
          formData.append("photo", base64String);

          // Now send the form data
          const response = await fetch(
            `/api/review${existingReview ? `/${existingReview._id}` : ""}`,
            {
              method: existingReview ? "PUT" : "POST",
              body: formData,
              credentials: "include",
              headers: {
                "x-user-id": userId,
              },
            }
          );

          const data = await response.json();
          console.log("API response:", data);

          if (!response.ok) {
            throw new Error(data.message || "Failed to submit review");
          }

          toast.success(
            existingReview
              ? "Your review has been updated!"
              : "Your review has been submitted!"
          );
          setIsOpen(false);
          setRating(0);
          setReviewText("");
          setPhoto(null);
          setPreviewUrl(null);
          setExistingReview(data.review);
          triggerRefresh();
        };
      } else {
        // If no photo, send the form data directly
        const response = await fetch(
          `/api/review${existingReview ? `/${existingReview._id}` : ""}`,
          {
            method: existingReview ? "PUT" : "POST",
            body: formData,
            credentials: "include",
            headers: {
              "x-user-id": userId,
            },
          }
        );

        const data = await response.json();
        console.log("API response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to submit review");
        }

        toast.success(
          existingReview
            ? "Your review has been updated!"
            : "Your review has been submitted!"
        );
        setIsOpen(false);
        setRating(0);
        setReviewText("");
        setPhoto(null);
        setPreviewUrl(null);
        setExistingReview(data.review);
        triggerRefresh();
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/review/${existingReview._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "x-user-id": userId,
        },
      });

      const data = await response.json();
      console.log("Delete API response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      toast.success("Your review has been deleted!");
      setIsOpen(false);
      setRating(0);
      setReviewText("");
      setPhoto(null);
      setPreviewUrl(null);
      setExistingReview(null);
      triggerRefresh();
    } catch (err) {
      console.error("Failed to delete review:", err);
      toast.error(err.message || "Failed to delete review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonText = existingReview ? "Edit Your Review" : "Add Review";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-[#83C5BE] hover:bg-[#006D77] text-white border-[#E29578]"
        >
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#FFDDD2] border-[#E29578] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#006D77] text-2xl">
            {existingReview ? "Edit Your Review" : "Add Your Review"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
                disabled={isSubmitting}
              >
                <Star
                  size={32}
                  className={
                    star <= (hoverRating || rating)
                      ? "fill-[#E29578] text-[#E29578]"
                      : "text-[#E29578]"
                  }
                />
              </button>
            ))}
          </div>
          <Textarea
            className="bg-white border-[#E29578] text-[#006D77] placeholder-[#83C5BE]"
            placeholder="Tell us what you think about this product..."
            rows={5}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
            disabled={isSubmitting}
          />
          <div className="space-y-2">
            <label className="text-[#006D77] text-sm font-medium">
              Upload a Photo (optional, PNG/JPG/JPEG only)
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#83C5BE] file:text-white hover:file:bg-[#006D77]"
              disabled={isSubmitting}
            />
            {previewUrl && (
              <div className="relative w-32 h-32 rounded-md overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Review image"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                  disabled={isSubmitting}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              className="bg-white text-[#006D77] border-gray-200 hover:bg-[#F7F7F7]"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            {existingReview && (
              <Button
                type="button"
                variant="destructive"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete Your Review
              </Button>
            )}
            <Button
              type="submit"
              className="bg-[#83C5BE] text-white hover:bg-[#006D77]"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting
                ? "Submitting..."
                : existingReview
                ? "Update Review"
                : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
