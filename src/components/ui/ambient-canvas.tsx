import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const AmbientCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates for elastic deflection
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Instantly lerp mouse tracking using GSAP standard animation
    const mouseLerp = gsap.to(mouse, {
      x: () => mouse.targetX,
      y: () => mouse.targetY,
      duration: 1.0,
      ease: "power2.out",
      paused: false,
    });

    // Large glowing atmospheric particle mesh specs
    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      parallaxDepth: number;
    }

    const colors = [
      "rgba(99, 102, 241, 0.12)",   // Indigo
      "rgba(168, 85, 247, 0.10)",   // Purple
      "rgba(16, 185, 129, 0.08)",   // Emerald
      "rgba(6, 182, 212, 0.10)",    // Cyan
      "rgba(244, 63, 94, 0.07)",     // Rose
    ];

    const particles: Particle[] = [];
    const particleCount = Math.min(28, Math.max(12, Math.floor((width * height) / 52000)));

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 200 + 100; // Giant blurred blobs
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius,
        color: colors[i % colors.length],
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        parallaxDepth: Math.random() * 0.12 + 0.04,
      });
    }

    // Capture vertical scroll distance for buttery parallax
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // GSAP high performance render loop tick binds directly to hardware frames
    const tickHandler = () => {
      if (!ctx || !canvas) return;
      
      // Clean canvas before redraw
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Draw faint grid gridline nodes
      ctx.strokeStyle = "rgba(63, 63, 70, 0.03)";
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        // Standard ambient drift
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Elegant torus screen wrapping
        if (p.baseX < -p.radius) p.baseX = width + p.radius;
        if (p.baseX > width + p.radius) p.baseX = -p.radius;
        if (p.baseY < -p.radius) p.baseY = height + p.radius;
        if (p.baseY > height + p.radius) p.baseY = -p.radius;

        // Apply scroll Parallax adjustment
        const scrollParallaxOffset = scrollY * p.parallaxDepth;
        let targetX = p.baseX;
        let targetY = p.baseY - scrollParallaxOffset;

        // Calculate dynamic elastic distance toward mouse pointer
        const dx = mouse.x - targetX;
        const dy = mouse.y - targetY;
        const distance = Math.hypot(dx, dy);
        const influenceRadius = 400;

        if (distance < influenceRadius) {
          const factor = (influenceRadius - distance) / influenceRadius;
          // Magnetically pull/shove particle centered glowing coords elegantly
          targetX -= (dx / distance) * factor * 50;
          targetY -= (dy / distance) * factor * 50;
        }

        // Apply subtle easing to keep scroll transitions perfect
        p.x += (targetX - p.x) * 0.05;
        p.y += (targetY - p.y) * 0.05;

        // Render soft atmospheric aura glow
        const radGradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius
        );
        radGradient.addColorStop(0, p.color);
        radGradient.addColorStop(0.5, p.color.replace("0.1", "0.03"));
        radGradient.addColorStop(1, "rgba(9, 9, 11, 0)");

        ctx.fillStyle = radGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    gsap.ticker.add(tickHandler);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      mouseLerp.kill();
      gsap.ticker.remove(tickHandler);
    };
  }, []);

  return (
    <canvas
      id="ambient-nebula-canvas"
      ref={canvasRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ backfaceVisibility: "hidden" }}
    />
  );
};
