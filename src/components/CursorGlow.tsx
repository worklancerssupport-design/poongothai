import { useEffect, useState } from "react";

/**
 * CursorGlow — very subtle cursor-following amber glow on desktop.
 * Disabled on mobile / touch, disabled for prefers-reduced-motion.
 */
export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only on fine-pointer desktops
    if (!window.matchMedia("(pointer:fine)").matches) return;
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="cursor-glow"
      style={{
        left: pos.x,
        top: pos.y,
        width: 380,
        height: 380,
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    />
  );
}
