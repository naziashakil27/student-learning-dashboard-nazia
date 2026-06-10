import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  range = 45,
  strength = 0.35,
}) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const bound = el.getBoundingClientRect();
      const elCenterX = bound.left + bound.width / 2;
      const elCenterY = bound.top + bound.height / 2;

      // Distance from mouse to center of the target elements
      const dx = e.clientX - elCenterX;
      const dy = e.clientY - elCenterY;
      const distance = Math.hypot(dx, dy);

      if (distance < range) {
        // Calculated pull ratio
        const pullX = dx * strength;
        const pullY = dy * strength;

        gsap.to(el, {
          x: pullX,
          y: pullY,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        // Smoothly glide back home
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1.2, 0.35)",
        overwrite: "auto",
      });
    };

    // Attach mouse coordinate tracker to the document window for global boundary check
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      // Clean up gsap translation transforms on destroy
      gsap.killTweensOf(el);
    };
  }, [range, strength]);

  return (
    <span ref={containerRef} className="inline-block" style={{ willChange: "transform" }}>
      {children}
    </span>
  );
};
