import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
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
  );
}