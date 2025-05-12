"use client";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pets } from "@/components/Profile/Pets";
import { Profile } from "@/components/Profile/Profile";
import { Posts } from "@/components/Profile/Posts";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      console.error("No user session found");
      router.push("/register");
      return;
    }

    if (session?.user?.email) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/api/profile`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setUser(response.data);
        } catch (err) {
          console.error("Error fetching user data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [session, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/3">
            <Profile user={user} />
          </aside>
          <div className="md:w-2/3">
            <div className="bg-background/80 p-4 rounded-lg shadow-lg">
              <Tabs defaultValue="pets" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="pets"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">Pets</span>
                      <span className="text-sm text-muted-foreground">
                        ({user?.pets?.length || 0})
                      </span>
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">Posts</span>
                      <span className="text-sm text-muted-foreground">
                        ({user?.posts?.length || 0})
                      </span>
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pets" className="pt-4">
                  <Pets pets={user?.pets || []} />
                </TabsContent>
                <TabsContent value="posts" className="pt-4">
                  <Posts posts={user?.posts || []} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
