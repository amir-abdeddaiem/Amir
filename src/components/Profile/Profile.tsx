"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface BusinessProvider {
  businessName?: string;
  description?: string;
  services?: string[];
  website?: string;
  businessType?: string;
  certifications?: string[];
}

interface UserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  gender?: string;
  location?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  businessProvider?: BusinessProvider | null;
  createdAt?: string;
  updatedAt?: string;
}

interface UserProfileProps {
  userId?: string;
  userEmail?: string;
}

export function Profile({ userId, userEmail }: UserProfileProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const goToProfile = () => {
    router.push("/Profile");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check if we have at least one identifier
        if (!userId && !userEmail) {
          setError("No user identifier provided");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Build request parameters
        const params = {
          ...(userId && { id: userId }),
          ...(userEmail && { email: userEmail })
        };

        // Make API request
        const { data } = await axios.get<UserData>("/api/profile", { 
          params,
          validateStatus: (status) => status < 500 // Don't throw for 404
        });

        if (!data) {
          throw new Error("User data not found");
        }

        setUser(data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }> | Error;
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setError("User not found");
          } else {
            setError(
              error.response?.data?.message || 
              error.message || 
              "Failed to load profile"
            );
          }
        } else {
          setError(error.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, userEmail]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
        <Button
          variant="ghost"
          size="md"
          className="mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center p-4">No user data available</div>;
  }

  const displayName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ") || "User";

  const bio = user?.bio || user?.businessProvider?.description;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map(n => n[0]?.toUpperCase() || "")
    .join("");

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="space-y-4">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage
            src={user.avatar}
            alt={displayName}
            className="object-cover"
          />
          <AvatarFallback className="text-3xl bg-muted">
            {initials}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-center text-xl">{displayName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bio && (
          <p className="text-center text-muted-foreground">{bio}</p>
        )}
        {user.location && (
          <div className="flex items-center justify-center gap-1 text-sm">
            <span>📍</span>
            <span>{user.location}</span>
          </div>
        )}
        {user.businessProvider?.businessName && (
          <div className="text-center font-medium">
            {user.businessProvider.businessName}
          </div>
        )}
        <Button
          onClick={goToProfile}
          variant="default"
          size="md"
          className="w-full bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90"
        >
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}


export default Profile
