import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertTriangle } from "lucide-react";

export default function HealthTab({ animal }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {animal.vaccinated ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Vaccinated
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                Not Vaccinated
              </Badge>
            )}

            {animal.neutered ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Neutered/Spayed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                Not Neutered/Spayed
              </Badge>
            )}

            {animal.microchipped ? (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Microchipped
              </Badge>
            ) : (
              <Badge variant="outline" className="text-gray-500">
                Not Microchipped
              </Badge>
            )}
          </div>

          {!animal.vaccinated && (
            <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                This pet is not vaccinated. We recommend getting vaccinations to
                protect your pet's health.
              </p>
            </div>
          )}

          {!animal.microchipped && (
            <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md">
              <Heart className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Consider microchipping your pet to help identify them if they
                ever get lost.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
