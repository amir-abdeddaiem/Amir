"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export function ReviewPopup({ productId }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stars: rating,
          message: reviewText,
          product: productId,
          userId: "6824d2e30b47408a868cacaf", // Replace with actual user ID
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      setIsOpen(false);
      setRating(0);
      setReviewText("");
      window.location.reload();
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-[#83C5BE] hover:bg-[#006D77] text-white border-[#E29578]"
        >
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#FFDDD2] border-[#E29578] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#006D77] text-2xl">
            Share Your Experience
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
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="bg-white text-[#006D77] border-[#E29578] hover:bg-[#FFDDD2]"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#83C5BE] hover:bg-[#006D77] text-white"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
