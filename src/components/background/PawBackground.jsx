"use client";

import { useEffect, useRef } from "react";

export default function PawBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Draw paw print
    const drawPaw = (x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Main pad
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.5, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Toes
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const toeX = Math.cos(angle) * size * 0.6;
        const toeY = Math.sin(angle) * size * 0.6;

        ctx.beginPath();
        ctx.ellipse(toeX, toeY, size * 0.25, size * 0.2, angle, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Generate random paw prints
    const generatePaws = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(226, 149, 120, 0.05)"; // #E29578 with low opacity

      const pawCount = Math.floor((canvas.width * canvas.height) / 40000);

      for (let i = 0; i < pawCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 10 + Math.random() * 20;
        const rotation = Math.random() * Math.PI * 2;

        drawPaw(x, y, size, rotation);
      }
    };

    generatePaws();
    window.addEventListener("resize", generatePaws);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("resize", generatePaws);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
