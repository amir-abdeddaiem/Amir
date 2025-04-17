"use client";

import { useState } from "react";
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

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I assist you with your pets today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: input, sender: "user" },
      ]);
      setInput("");
      // Here you would typically send the message to your chatbot API
      // and then add the response to the messages
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "I'm sorry, I'm just a demo chatbot. In a real application, I would provide helpful information about pet care!",
            sender: "bot",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Pet Care Chatbot
        </h1>
        <Card className="flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>Chat with our AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        message.sender === "user"
                          ? "/placeholder.svg?height=40&width=40&text=You"
                          : "/placeholder.svg?height=40&width=40&text=Bot"
                      }
                    />
                    <AvatarFallback>
                      {message.sender === "user" ? "You" : "Bot"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-2 ${
                      message.sender === "user"
                        ? "bg-primary text-white"
                        : "bg-secondary"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <div className="flex w-full space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
