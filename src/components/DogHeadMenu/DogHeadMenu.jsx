"use client";

import { useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Search, MessageCircle, Bot, Info, X } from "lucide-react";

// Dog head model component
function DogHead({ isOpen, onClick }) {
  const { scene } = useGLTF("/assets/duck.glb"); // Using duck as placeholder
  const meshRef = useRef();
  const { viewport } = useThree();

  // Animate the dog head
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group
      ref={meshRef}
      onClick={onClick}
      scale={[0.5, 0.5, 0.5]}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

export default function DogHeadMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: ShoppingBag, label: "Marketplace", href: "/marketplace" },
    { icon: Search, label: "Lost/Found Animals", href: "/lost-found" },
    { icon: MessageCircle, label: "Community Discussion", href: "/community" },
    { icon: Bot, label: "Chatbot", href: "/chatbot" },
    { icon: Info, label: "About", href: "/about" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* 3D Dog Head Button */}
      <div
        className={`relative h-16 w-16 cursor-pointer rounded-full bg-[#FFDDD2] shadow-lg transition-all duration-300 ${
          isOpen ? "scale-110" : "hover:scale-105"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <DogHead isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          <Environment preset="sunset" />
        </Canvas>
      </div>

      {/* Menu Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute bottom-20 right-0 w-64 rounded-2xl bg-white p-4 shadow-xl"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 85%, 85% 85%, 70% 100%, 55% 85%, 0% 85%)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#E29578]">Menu</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-[#FFDDD2]"
                    >
                      <item.icon className="h-5 w-5 text-[#E29578]" />
                      <span className="text-gray-700">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
