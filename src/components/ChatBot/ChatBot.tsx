"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Suspense } from "react";
import Link from "next/link";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

type ChatBotProps = {
  role: string;
};

interface ModelProps {
  url: string;
  mouseX: number;
  mouseY: number;
}

function Model({ url, mouseX, mouseY }: ModelProps) {
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, scene);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
      }
    }
  }, [actions]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
      const deltaX = (mouseX / window.innerWidth - 0.5) * 0.1;
      const deltaY = (mouseY / window.innerHeight - 0.5) * 0.1;
      modelRef.current.rotation.y += (deltaX - modelRef.current.rotation.y) * 0.1;
      modelRef.current.rotation.x += (deltaY - modelRef.current.rotation.x) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1.5} />;
}

export default function ChatBot({ role }: ChatBotProps) {

  const fetched = async () => {
    const courses = await axios.get('http://localhost:8000/courses/api/courses/');
    return courses.data;
  };

  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await fetched();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const DEFAULT_ROLE = `
You are Luna, an assistant for an e-learning platform also named Luna that offers IT courses. Your job is to:

- Respond to questions related to:
${courses.map(course => `• <a href="http://localhost:3000/Courses/${course.id}">${course.title}</a>: ${course.description || 'No description provided.'}`).join('\n')}

- You can also provide links to the courses:
  → You can find the full course catalog here: <a href='http://localhost:3000/Courses'>View All Courses</a>.

- Polite replies:
    - [hi, hello, hey, etc.] → "Hello! I'm Luna, your learning assistant. How can I help you today?"
    - [thank you, thanks] → "You're welcome! Feel free to ask if you need help with anything else."
    - [bye, goodbye] → "Goodbye! Happy learning!"
    - [I'm sorry] → "No problem at all. Let’s get it sorted!"
    - [I don't understand] → "No worries! Could you please explain what you're struggling with? I'll guide you."

- If someone asks:
    - "What is the best course?" → "The best course depends on your goals! Please check our course catalog."

- For non-IT topics:
    - "I specialize in IT topics. Please ask me about technology or your courses."

- Here are all the courses we offer:
${courses.map(course => `<a href='http://localhost:3000/Courses/${course.id}>${course.title}</a>: ${course.description || 'No description provided.'}`).join('\n')}

- If the user asks about a course, provide a brief description and a direct link to that course.
- If the user asks about a specific topic or technology, suggest relevant courses.
`;

  role = role || DEFAULT_ROLE;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dots, setDots] = useState<string>(''); 

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length < 3) {
          return prev + '.';
        } else {
          return '';
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchBotResponse = async (userMessage: string) => {
    setIsBotTyping(true);
    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "qwen2.5", //"llava"
        prompt: `[System]: ${role}\n[User]: ${userMessage}\n[Assistant]:`,
        stream: false,
        options: {
          temperature: 0.7,
          num_ctx: 2048,
          seed: 42,
        } 
      });
      console.log(response.data.response, role);
      setMessages((prev) => [...prev, { role: "bot", text: response.data.response || "I couldn't understand that." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Error fetching response." }]);
    }
    setIsBotTyping(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { role: "user", text: message }]);
    fetchBotResponse(message);
    setMessage("");
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="fixed bottom-4 right-4 z-50">
        <div className={`${isOpen ? "block fixed top-[84%] w-40 left-[43%]" : "w-40 fixed top-[84%] left-[87%]"} transition-all duration-300`}>
          <Canvas camera={{ position: [0, 1, 2] }} onClick={() => setIsOpen(!isOpen)} className="w-20 h-20 cursor-pointer">
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 1, 1]} intensity={1.2} />
            <Suspense fallback={null}>
              <Model url="/Models/cat.glb" mouseX={mousePosition.x} mouseY={mousePosition.y} />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
          </Canvas>
        </div>
        {isOpen && (
          <div className="mt-2 bg-blue-300 p-4 dark:bg-gray-800 dark:border border-gray-700 rounded-lg w-80 shadow-lg transition-opacity duration-300 w-150 h-100">
            <h2 className="text-white text-lg font-semibold">Chat with the Bot</h2>
            <div>
              <div ref={chatBoxRef} className="h-73 overflow-y-auto p-3 bg-blue-200 dark:bg-gray-700 rounded-md">
                {messages.map((msg, index) => (
                  <div key={index} className={`p-2 mt-1 m-0 rounded-lg max-w-sm ${msg.role === "user" ? "bg-blue-400 w-[80%] text-white ml-auto" : "dark:bg-gray-600 bg-green-400 text-gray dark:text-white"}`}>
                    <div className="markdown-body text-white">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" />
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isBotTyping && <span className="text-3xl text-white">{dots}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  className="flex-1 p-2 bg-blue-500 dark:bg-gray-900 text-white dark:border dark:border-gray-700 rounded-md"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
