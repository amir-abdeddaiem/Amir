import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Pic } from "@/components/Produit/Pic";

// Mock data
const productData = {
  id: "1",
  name: "Premium Dog Food",
  price: "$29.99",
  description:
    "High-quality, nutritious dog food suitable for all breeds. Made with real chicken and vegetables.",
  features: [
    "Made with real chicken",
    "No artificial preservatives",
    "Rich in essential nutrients",
    "Supports healthy digestion",
  ],
  reviews: [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      comment: "My dog loves this food! His coat looks shinier too.",
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      comment: "Good quality food, but a bit pricey.",
    },
    {
      id: 3,
      user: "Mike R.",
      rating: 5,
      comment: "Excellent product. Will buy again!",
    },
  ],
};

export default function ProductPage({ params }) {
  const product = productData;

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <Pic />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4 text-[#006D77]">
              {product.name}
            </h1>
            <p className="text-2xl font-bold text-[#E29578] mb-4">
              {product.price}
            </p>
            <p className="mb-4 text-[#006D77]">{product.description}</p>

            {/* Features */}
            <h2 className="text-xl font-bold mb-2 text-[#006D77]">Features:</h2>
            <ul className="list-disc list-inside mb-4 text-[#006D77]">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            {/* Add to Cart Button */}
            <Button className="w-full mb-4 bg-[#83C5BE] hover:bg-[#006D77] text-white">
              Add to Cart
            </Button>

            {/* Reviews Card */}
            <Card className="bg-[#FFDDD2] border-[#E29578]">
              <CardHeader>
                <CardTitle className="text-[#006D77]">
                  Customer Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.reviews.map((review) => (
                  <div key={review.id} className="mb-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-[#006D77]">
                        {review.user}
                      </span>
                      <span className="text-[#E29578]">
                        {"⭐".repeat(review.rating)}
                      </span>
                    </div>
                    <p className="text-[#006D77]">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full bg-[#83C5BE] hover:bg-[#006D77] text-white border-[#E29578]"
                >
                  Write a Review
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
