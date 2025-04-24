import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

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
  return (
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
  );
}