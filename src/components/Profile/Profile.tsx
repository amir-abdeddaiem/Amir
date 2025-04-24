import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfileProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate?: string;
    gender?: string;
    location?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
  };
}

export function Profile({ user }: UserProfileProps) {
  const fullName = `${user.firstName} ${user.lastName}`;
  
  return (
    <Card className="">
      <CardHeader className="">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage src={user.avatar} alt={fullName} className="" />
          <AvatarFallback className="">
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-center">{fullName}</CardTitle>
      </CardHeader>
      <CardContent className="">
        {user.bio && <p className="text-center mb-4">{user.bio}</p>}
        {user.location && <p className="text-center mb-2">📍 {user.location}</p>}
        <Button className="w-full" variant="default" size="md">Edit Profile</Button>
      </CardContent>
    </Card>
  );
}