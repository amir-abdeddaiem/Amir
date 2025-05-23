"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalPrice = items.reduce((total, item) => total + item.price, 0);

  const handleCheckout = () => {
    setIsCheckingOut(true);

    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      // In a real app, you would redirect to a success page
      alert("Checkout successful! Thank you for your purchase.");
    }, 2000);
  };

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
        <p className="text-muted-foreground">
          Review your items before checkout
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-10 w-10 text-muted-foreground" />}
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          actionLabel="Browse Products"
          actionHref="/"
        />
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {item.category}
                          </p>
                          <p className="font-semibold mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-5 w-5 text-muted-foreground" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Checkout"}
                </Button>
                <div className="text-center mt-4">
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
