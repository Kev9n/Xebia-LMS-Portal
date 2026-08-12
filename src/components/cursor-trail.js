import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";

export function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Track mouse position
    const mouse = { x: -100, y: -100, active: false };
    const pos = { x: -100, y: -100 }; // For smooth following

    // Dynamic resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!mouse.active) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouse.active) {
        // Smoothly move pos towards mouse
        pos.x += (mouse.x - pos.x) * 0.3;
        pos.y += (mouse.y - pos.y) * 0.3;

        const size = 6; // Diamond half-width

        // Draw a minimalist diamond
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - size); // Top
        ctx.lineTo(pos.x + size, pos.y); // Right
        ctx.lineTo(pos.x, pos.y + size); // Bottom
        ctx.lineTo(pos.x - size, pos.y); // Left
        ctx.closePath();

        // Fill and stroke
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)"; // Neutral color instead of brand color
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return _jsx("canvas", {
    ref: canvasRef,
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: 9999,
    },
  });
}
