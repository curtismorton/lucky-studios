import { useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useCallback, type MouseEvent } from "react";

const springConfig = { stiffness: 170, damping: 22, mass: 0.2 };

interface TiltOptions {
  max?: number;
  glowSize?: number;
}

export function useTilt({ max = 10, glowSize = 420 }: TiltOptions = {}) {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, springConfig);
  const rotateY = useSpring(tiltY, springConfig);
  const glowX = useMotionValue("50%");
  const glowY = useMotionValue("50%");
  const glow = useMotionTemplate`radial-gradient(${glowSize}px at ${glowX} ${glowY}, rgba(255, 255, 255, 0.18), transparent 65%)`;

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateXValue = ((y / rect.height) - 0.5) * -max;
      const rotateYValue = ((x / rect.width) - 0.5) * max;

      tiltX.set(rotateXValue);
      tiltY.set(rotateYValue);
      glowX.set(`${(x / rect.width) * 100}%`);
      glowY.set(`${(y / rect.height) * 100}%`);
    },
    [max, tiltX, tiltY, glowX, glowY]
  );

  const handleMouseLeave = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
    glowX.set("50%");
    glowY.set("50%");
  }, [tiltX, tiltY, glowX, glowY]);

  return {
    rotateX,
    rotateY,
    glow,
    handleMouseMove,
    handleMouseLeave,
  };
}
