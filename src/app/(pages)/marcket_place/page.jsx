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


export default function Marketplace() {
  return (
    <>
      <Navbar />
      <FilterP />
      <Footer />
    </>
  );
}
