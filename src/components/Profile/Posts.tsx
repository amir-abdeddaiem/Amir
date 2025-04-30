"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface Post {
  id: string | number;
  title: string;
  content: string;
  likes: number;
  comments: number;
}

interface PostsProps {
  posts: Post[];
}

export function Posts({ posts }: PostsProps) {
   const router = useRouter();
    const addpost = () => {
      router.push("/add-animal"); // Naviguer vers la page /about
    };
  return (
    <>
    <Button  onClick={addpost}variant="default" size="lg" className="w-[60%] mx-auto my-4 h-8 bg-[#83C5BE] hover:bg-[#006D77] text-white flex items-center justify-center" >
      Add Post
    </Button>
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="">
          <CardHeader className="">
            <CardTitle className="">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="">
            <p>{post.content}</p>
            <div className="mt-2 flex justify-between text-sm text-gray-500">
              <span>❤️ {post.likes} likes</span>
              <span>💬 {post.comments} comments</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    </>
  );
}