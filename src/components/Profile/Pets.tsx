"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface Pet {
  name: string;
  type: string;
  breed: string;
  image?: string;
}

interface PetsProps {
  pets: Pet[];
}

export function Pets({ pets }: PetsProps) {
  const router = useRouter();
  const addanimal = () => {
    router.push("/add-animal"); // Naviguer vers la page /about
  };
  return (
    <>
    <Button onClick={addanimal} variant="default" size="lg" className="w-[60%] mx-auto my-4 h-8 bg-[#83C5BE] hover:bg-[#006D77] text-white flex items-center justify-center" >
      Add Pet
    </Button>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      
      {pets.map((pet) => (
        <Card key={pet.name} className="">
          <CardHeader className="">
            <Image
              src={pet.image || "/placeholder.svg"}
              alt={pet.name}
              width={100}
              height={100}
              className="rounded-full mx-auto"
            />
          </CardHeader>
          <CardContent className="text-center">
            <h3 className="font-bold">{pet.name}</h3>
            <p>{pet.breed}</p>
            <p className="text-sm text-gray-500">{pet.type}</p>
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  );
}