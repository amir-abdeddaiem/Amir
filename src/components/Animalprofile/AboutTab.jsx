import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AboutTab({ animal }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="mb-4">{animal.description}</p>
        <div className="mt-6">
          <Label className="font-medium text-gray-700 mb-2">
            Friendly With
          </Label>
          <div className="grid grid-cols-2 gap-y-2">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${
                  animal.friendly.children ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Children</span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${
                  animal.friendly.dogs ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Dogs</span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${
                  animal.friendly.cats ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Cats</span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${
                  animal.friendly.other ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Other Animals</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
