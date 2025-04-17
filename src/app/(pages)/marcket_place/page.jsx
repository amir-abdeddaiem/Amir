import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Produit } from "@/components/Produit/Produit";
import { FilterP } from "@/components/Produit/FilterP";

const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    price: "$29.99",
    image: "/placeholder.svg?height=200&width=200&text=Dog+Food",
  },
  {
    id: 2,
    name: "Cat Tree",
    price: "$59.99",
    image: "/placeholder.svg?height=200&width=200&text=Cat+Tree",
  },
  {
    id: 3,
    name: "Bird Cage",
    price: "$39.99",
    image: "/placeholder.svg?height=200&width=200&text=Bird+Cage",
  },
  {
    id: 4,
    name: "Fish Tank",
    price: "$89.99",
    image: "/placeholder.svg?height=200&width=200&text=Fish+Tank",
  },
  {
    id: 5,
    name: "Hamster Wheel",
    price: "$19.99",
    image: "/placeholder.svg?height=200&width=200&text=Hamster+Wheel",
  },
];

export default function Marketplace() {
  return (
    <>
      <Navbar />
      <FilterP />
      <Footer />
    </>
  );
}
