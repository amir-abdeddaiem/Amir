import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Weight,
  Edit,
  Trash2,
  Heart,
  AlertTriangle,
} from "lucide-react";
import AboutTab from "./tabs/AboutTab";
import HealthTab from "./tabs/HealthTab";
import OwnerTab from "./tabs/OwnerTab";

export default function ViewProfile({
  animal,
  startEditing,
  setDeleteDialogOpen,
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Image and basic info */}
        <div className="md:w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                <img
                  src={animal.image || "/placeholder.svg"}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">
                {animal.name}
              </h2>
              <div className="flex justify-center space-x-2 mb-4">
                <Badge
                  variant="outline"
                  className="bg-[#FFDDD2] text-[#E29578] border-[#E29578]"
                >
                  {animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-[#FFDDD2] text-[#E29578] border-[#E29578]"
                >
                  {animal.breed}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-[#83C5BE]" />
                  <span>
                    {animal.age}{" "}
                    {Number.parseInt(animal.age) === 1 ? "year" : "years"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Weight className="h-4 w-4 mr-2 text-[#83C5BE]" />
                  <span>{animal.weight} kg</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex space-x-2">
            <Button onClick={startEditing} className="flex-1">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right column - Tabs with details */}
        <div className="md:w-2/3">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4">
              <AboutTab animal={animal} />
            </TabsContent>

            <TabsContent value="health" className="mt-4">
              <HealthTab animal={animal} />
            </TabsContent>

            <TabsContent value="owner" className="mt-4">
              <OwnerTab animal={animal} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
