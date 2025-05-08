"use client";

import { useJwt } from "@/hooks/useJwt";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface UserInfoProps {
  className?: string;
}

export default function UserInfo({ className }: UserInfoProps) {
  const { getUserId, getEmail } = useJwt();
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userId = await getUserId();
        const email = await getEmail();
        
        if (!userId || !email) {
          setUserData(null);
          return;
        }

        // You could make an API call here to get more user data if needed
        // For now, we'll just show the email
        setUserData({
          name: "User Name", // You might want to get this from the API
          email: email
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [getUserId, getEmail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="">
        <CardTitle className="">User Information</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="space-y-2">
          <p className="font-medium">Name: {userData.name}</p>
          <p className="text-sm text-gray-600">Email: {userData.email}</p>
        </div>
      </CardContent>
    </Card>
  );
}
