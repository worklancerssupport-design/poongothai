import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { contactData } from "@/data/contact";
import { WhatsAppIcon } from "./SocialIcons";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <motion.a
        href={`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(contactData.whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 180 }}
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center rounded-full shadow-xl wa-pulse"
        style={{ width: 52, height: 52, background: "#25D366" }}
      >
        <WhatsAppIcon className="w-6 h-6 text-white" />
      </motion.a>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{   scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-colors"
            style={{ width: 44, height: 44, background: "#5C3A2E" }}
            whileHover={{ scale: 1.1 }}
          >
            <ArrowUp className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
