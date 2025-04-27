"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const { data: session, status: sessionStatus } = useSession();
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
        setLoading(true);
        setError(null);

        let params: { id?: string; email?: string } = {};
        if (userId) {
          params = { id: userId };
        } else if (userEmail) {
          params = { email: userEmail };
        } else if (session?.user?.email) {
          params = { email: session.user.email };
        } else {
          throw new Error('No user identifier available');
        }

        const response = await axios.get(`/api/profile/${params.id || ''}`, { params });
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus !== "loading") {
      fetchUserData();
    }
  }, [userId, userEmail, session?.user?.email, sessionStatus]);

  if (sessionStatus === "loading" || loading) {
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

  if (!session) {
    return <div className="text-center p-4">Please sign in to view profile</div>;
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
    <Card className="max-w-md mx-auto">
      <CardHeader className="space-y-4">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage
            src={avatarUrl}
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
        {user?.location && (
          <div className="flex items-center justify-center gap-1 text-sm">
            <span>📍</span>
            <span>{user.location}</span>
          </div>
        )}
        {user?.businessProvider?.businessName && (
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