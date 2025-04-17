"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the post data to your backend API
    console.log("Submitting post:", { title, content });
    // After successful submission, redirect to the community page
    router.push("/community");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">
          Create a New Post
        </h1>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Share your thoughts with the community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here"
                  rows={6}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Publish Post
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
