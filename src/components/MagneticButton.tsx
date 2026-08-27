import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  strength?: number;
  as?: "button" | "a";
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

/**
 * MagneticButton — subtle magnetic hover effect for premium CTAs.
 * Only active on desktop pointer devices.
 * Gracefully degrades to normal button on touch devices.
 */
export default function MagneticButton({
  children,
  className = "",
  style,
  onClick,
  href,
  target,
  rel,
  strength = 0.3,
  as = "button",
  type = "button",
  "aria-label": ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    // Only on fine pointer (mouse)
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  const motionProps = {
    ref: ref as React.Ref<HTMLButtonElement>,
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring" as const, stiffness: 350, damping: 28, mass: 0.5 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    className,
    style,
    "aria-label": ariaLabel,
  };

  if (as === "a" && href) {
    return (
      <motion.a
        {...(motionProps as any)}
        href={href}
        target={target}
        rel={rel}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} type={type}>
      {children}
    </motion.button>
  );
}
