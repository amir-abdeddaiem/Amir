"use client";
import React from "react";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash, Edit, Plus } from "lucide-react";
import Image from "next/image";
function Test() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium Dog Food",
      price: "29.99",
      description: "High-quality dog food for all breeds",
      image: "/placeholder.svg?height=200&width=200&text=Dog+Food",
    },
    {
      id: 2,
      name: "Cat Tree",
      price: "59.99",
      description: "Multi-level cat tree with scratching posts",
      image: "/placeholder.svg?height=200&width=200&text=Cat+Tree",
    },
    {
      id: 3,
      name: "Bird Cage",
      price: "39.99",
      description: "Spacious cage for small to medium birds",
      image: "/placeholder.svg?height=200&width=200&text=Bird+Cage",
    },
    {
      id: 4,
      name: "Fish Tank",
      price: "89.99",
      description: "10-gallon aquarium with filter system",
      image: "/placeholder.svg?height=200&width=200&text=Fish+Tank",
    },
    {
      id: 5,
      name: "Hamster Wheel",
      price: "19.99",
      description: "Silent spinner wheel for small pets",
      image: "/placeholder.svg?height=200&width=200&text=Hamster+Wheel",
    },
    {
      id: 6,
      name: "Dog Leash",
      price: "14.99",
      description: "Durable nylon leash with comfortable handle",
      image: "/placeholder.svg?height=200&width=200&text=Dog+Leash",
    },
  ]);

  // State for add/edit product form
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const handleAddProduct = () => {
    const newProduct = {
      ...currentProduct,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      image:
        currentProduct.image ||
        `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
          currentProduct.name
        )}`,
    };

    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
    resetForm();
  };
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => openEditDialog(product)}
      >
        r
      </Button>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-2">
              <label htmlFor="name">Product Name</label>
              <Input
                id="name"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
                placeholder="Enter product name"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="price">Price ($)</label>
              <Input
                id="price"
                value={currentProduct.price}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    price: e.target.value,
                  })
                }
                placeholder="Enter price"
                type="number"
                step="0.01"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={currentProduct.description}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
                placeholder="Enter product description"
              />
            </div>
            <div className="grid w-full items-center gap-2">
              <label htmlFor="image">Image URL (optional)</label>
              <Input
                id="image"
                value={currentProduct.image}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    image: e.target.value,
                  })
                }
                placeholder="Enter image URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Test;
