import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import AddPost from "./addpost/page";

const posts = [
  {
    id: 1,
    author: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40&text=JD",
    title: "Tips for new pet owners",
    content: "Here are some tips for new pet owners...",
    likes: 15,
    comments: 5,
  },
  {
    id: 2,
    author: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
    title: "Best dog parks in the city",
    content: "I've compiled a list of the best dog parks...",
    likes: 23,
    comments: 8,
  },
  {
    id: 3,
    author: "Mike Johnson",
    avatar: "/placeholder.svg?height=40&width=40&text=MJ",
    title: "Cat behavior explained",
    content: "Ever wondered why your cat does that? Here's why...",
    likes: 19,
    comments: 12,
  },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Community Discussion
        </h1>
        <div className="mb-8">
          <Input className="mb-4" placeholder="Start a new discussion..." />
          <Button>{/* <AddPost /> */}</Button>
        </div>
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} />
                    <AvatarFallback>
                      {post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <p className="text-sm text-gray-500">by {post.author}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost">❤️ {post.likes}</Button>
                <Button variant="ghost">💬 {post.comments}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
