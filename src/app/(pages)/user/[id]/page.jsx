"use client"
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Pets} from "@/components/Profile/Pets";
import {Profile} from "@/components/Profile/Profile";
import {Posts} from "@/components/Profile/Posts";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
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
        }
      };
      fetchUser();
    } else {
      console.error("No user ID provided");
      router.push("/404");
    }
  }, [session]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
      <div className="min-h-screen bg-background">
        <Navbar/>
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/3">
              <Profile user={user}/>
            </aside>
            <div className="md:w-2/3">
              <Tabs defaultValue="pets" className="">
                <TabsList className="w-full">
                  <TabsTrigger value="pets" className="w-full">
                    Pets
                  </TabsTrigger>
                  <TabsTrigger value="posts" className="w-full">
                    Posts
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="pets" className="">
                  <Pets pets={user?.pets || []}/>
                </TabsContent>
                <TabsContent value="posts" className="">
                  <Posts posts={user?.posts || []}/>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
  );
}
