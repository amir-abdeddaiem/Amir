import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OwnerTab({ animal }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Owner Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={animal.owner.image || "/placeholder.svg"}
              alt={animal.owner.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{animal.owner.name}</h3>
            <p className="text-sm text-gray-500">
              Owner since {new Date(animal.createdAt).toDateString()}
            </p>
            <Button
              variant="link"
              className="p-0 h-auto text-[#E29578]"
              asChild
            >
              <a href={`/user/${animal.owner.id}`}>View Profile</a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
