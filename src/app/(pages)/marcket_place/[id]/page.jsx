import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pic } from "@/components/Produit/Pic";
import { ReviewPopup } from "@/components/Produit/review/ReviewPopup";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";
import { connectDB } from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  await connectDB();

  try {
    const product = await Product.findById(params.id);
    // .populate("user", "name email")
    // .lean();

    if (!product) return notFound();

    // Fetch reviews separately
    const reviews = await Review.find({ product: params.id });
    //   .populate("user", "firstName lastName")
    //   .lean();

    return (
      <div className="min-h-screen bg-[#EDF6F9]">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full max-w-md aspect-square overflow-hidden rounded-2xl shadow-lg">
              <Pic imageUrl={product.image} />
            </div>

            <div className="md:w-full top-20">
              <h1 className="text-3xl font-bold mb-4 text-[#006D77]">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-[#E29578] mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="mb-4 text-[#006D77]">{product.description}</p>

              <h2 className="text-xl font-bold mb-2 text-[#006D77]">
                Specifications:
              </h2>
              <ul className="list-disc list-inside mb-4 text-[#006D77]">
                {product.specifications.map((spec, index) => (
                  <li key={index}>
                    <strong>{spec.key}:</strong> {spec.value}
                  </li>
                ))}
              </ul>

              <Card className="bg-[#FFDDD2] border-[#E29578] top-20">
                <CardHeader>
                  <CardTitle className="text-[#006D77]">
                    Customer Reviews ({reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.map((review) => (
                    <div key={review._id.toString()} className="mb-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-[#006D77]">
                          testusername testuserlastname
                          {/* {review.user?.firstName} {review.user?.lastName} */}
                        </span>
                        <span className="text-[#E29578]">
                          {"⭐".repeat(review.stars)}
                        </span>
                      </div>
                      <p className="text-[#006D77]">{review.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <ReviewPopup productId={params.id} />
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return notFound();
  }
}
