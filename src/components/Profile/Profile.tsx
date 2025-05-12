"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useJwt } from "@/hooks/useJwt";
import { Loader2 } from "lucide-react";
import type { AxiosError } from "axios";

interface ApiResponse {
  success: boolean;
  error?: string;
  data?: any;
}

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

export default   function Profile({ userId, userEmail }: UserProfileProps) {
  const { data: session, status: sessionStatus } = useSession();
  const { getUserId } = useJwt();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse>(`/api/profile`);
        
        if (!response.data.success) {
          throw new Error(response.data.error || "Failed to fetch profile");
        }

        setUser(response.data.data);
      } catch (err) {
        const error = err as AxiosError<ApiResponse>;
        setError(error.response?.data?.error || "Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      fetchProfile();
    }
  }, [sessionStatus]);

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-red-500 dark:text-red-400">{error}</div>
            <Button
              variant="ghost"
              size="md"
              className="mt-2 text-gray-900 dark:text-white"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Please sign in to view profile
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : session?.user?.name || 'User';

  const bio = user?.bio || user?.businessProvider?.description;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0]?.toUpperCase() || '')
    .join('');

  const avatarUrl = user?.avatar || session?.user?.image || undefined;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <Avatar className="w-40 h-40 mb-4 bg-gray-100 dark:bg-gray-800">
                  <AvatarImage className="object-cover" src={user?.avatar || undefined} alt="Profile" />
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {displayName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Birth Date</p>
                        <p className="text-gray-900 dark:text-white">{user?.birthDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="text-gray-900 dark:text-white">{user?.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-gray-900 dark:text-white">{user?.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-gray-900 dark:text-white">{user?.phone}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">Bio</h3>
                    <p className="text-gray-700 dark:text-gray-300">{bio}</p>
                  </div>
                </Card>
                {user?.businessProvider && (
                  <Card className="p-6 bg-white dark:bg-gray-800">
                    <CardHeader className=""  >
                      <CardTitle className="text-gray-900 dark:text-white">Business Information</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Business Name</p>
                          <p className="text-gray-900 dark:text-white">{user?.businessProvider.businessName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                          <p className="text-gray-700 dark:text-gray-300">{user?.businessProvider.description}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                          <p className="text-gray-900 dark:text-white">{user?.businessProvider.website}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={() => router.push('/Profile')}
            variant="default"
            size="md"
            className="w-full bg-[#83C5BE] text-white hover:bg-[#83C5BE]/90"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}