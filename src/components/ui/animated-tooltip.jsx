"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import axios from "axios";

export const AnimatedTooltip = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [animalUsers, setAnimalUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );

  useEffect(() => {
    const fetchAnimalUsers = async () => {
      try {
        const response = await axios.get("/api/animal");
        setAnimalUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching animal users:", error);
        setLoading(false);
      }
    };

    fetchAnimalUsers();
  }, []);

  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  // const handleItemClick = async (item) => {
  //   try {
  //     if (selectedItem === item.id) {
  //       // If clicking the already selected item, deselect it
  //       await axios.delete(`/api/matchy/animal/${item.id}`);
  //       setSelectedItem(null);
  //     } else {
  //       // If clicking a new item
  //       if (selectedItem) {
  //         // First deselect the currently selected item
  //         await axios.delete(`/api/matchy/animal/${selectedItem}`);
  //       }
  //       // Then select the new item
  //       await axios.post("/api/matchy/animal", { animalId: item.id });
  //       setSelectedItem(item.id);
  //     }
  //   } catch (error) {
  //     console.error("Error updating selection:", error);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <>
      {animalUsers.map((item, idx) => (
        <div
          className="group relative -mr-4"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          // onClick={() => handleItemClick(item)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-white">{item.type}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className={`relative !m-0 h-14 w-14 rounded-full border-2 object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105 ${
              selectedItem === item.id
                ? "border-red-500 filter brightness-110"
                : "border-gray-300 filter grayscale"
            }`}
          />
        </div>
      ))}
    </>
  );
};
