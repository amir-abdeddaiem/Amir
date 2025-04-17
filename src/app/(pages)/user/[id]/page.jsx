import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// This is mock data. In a real application, you'd fetch this data based on the user ID.
const userData = {
  id: "1",
  name: "Jane Doe",
  avatar: "/placeholder.svg?height=200&width=200&text=Jane",
  bio: "Animal lover and proud pet parent. I have two dogs and a cat!",
  pets: [
    {
      name: "Max",
      type: "Dog",
      breed: "Golden Retriever",
      image: "/placeholder.svg?height=100&width=100&text=Max",
    },
    {
      name: "Luna",
      type: "Cat",
      breed: "Siamese",
      image: "/placeholder.svg?height=100&width=100&text=Luna",
    },
    {
      name: "Rocky",
      type: "Dog",
      breed: "German Shepherd",
      image: "/placeholder.svg?height=100&width=100&text=Rocky",
    },
  ],
  posts: [
    {
      id: 1,
      title: "My favorite pet toys",
      content: "Here are some of my pets' favorite toys...",
      likes: 15,
      comments: 5,
    },
    {
      id: 2,
      title: "Tips for new pet owners",
      content: "If you're a new pet owner, here are some tips...",
      likes: 23,
      comments: 8,
    },
  ],
};

export default function UserProfile({ params }) {
  // In a real application, you'd use params.id to fetch the user data
  const user = userData;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/3">
            <Card>
              <CardHeader>
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center mb-4">{user.bio}</p>
                <Button className="w-full">Edit Profile</Button>
              </CardContent>
            </Card>
          </aside>
          <div className="md:w-2/3">
            <Tabs defaultValue="pets">
              <TabsList className="w-full">
                <TabsTrigger value="pets" className="w-full">
                  Pets
                </TabsTrigger>
                <TabsTrigger value="posts" className="w-full">
                  Posts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pets">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {user.pets.map((pet) => (
                    <Card key={pet.name}>
                      <CardHeader>
                        <Image
                          src={pet.image || "/placeholder.svg"}
                          alt={pet.name}
                          width={100}
                          height={100}
                          className="rounded-full mx-auto"
                        />
                      </CardHeader>
                      <CardContent className="text-center">
                        <h3 className="font-bold">{pet.name}</h3>
                        <p>{pet.breed}</p>
                        <p className="text-sm text-gray-500">{pet.type}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="posts">
                <div className="space-y-4">
                  {user.posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{post.content}</p>
                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                          <span>❤️ {post.likes} likes</span>
                          <span>💬 {post.comments} comments</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
