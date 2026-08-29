import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu as MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDataContext } from "@/contexts/DataContext";

const SALON_LOGO =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgjNvD9C9ig9pN02Zl3FOd_1RHv8zFedEelsVRrQbafz6By3DlCQdS-28&s=10";

// Minimal center navigation items for the clean desktop bar
const CENTER_LINKS = [
  { label: "Home",     href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Gallery",  href: "#gallery" },
];

// Full expanded menu items with editorial numbering and specific actions
const FULL_MENU_ITEMS = [
  { num: "01", label: "HOME",               href: "#hero",       action: "scroll" as const },
  { num: "02", label: "HAIRSTYLES",         href: "#hairstyles", action: "catalogue" as const },
  { num: "03", label: "HAIRSTYLE PICTURES", href: "#hairstyles", action: "scroll" as const },
  { num: "04", label: "SERVICES",           href: "#services",   action: "scroll" as const },
  { num: "05", label: "BRIDAL",             href: "#bridal",     action: "scroll" as const },
  { num: "06", label: "GALLERY",            href: "#gallery",    action: "scroll" as const },
  { num: "07", label: "CONTACT",            href: "#contact",    action: "scroll" as const },
];

interface NavbarProps {
  onOpenCatalogue: () => void;
}

export default function Navbar({ onOpenCatalogue }: NavbarProps) {
  const { contact: contactData } = useDataContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", "hairstyles", "services", "packages", "bridal", "gallery", "contact"];
    const updateActive = () => {
      const probe = window.scrollY + window.innerHeight * 0.35;
      let cur = "#hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= probe) cur = `#${id}`;
      }
      setActive(cur);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  // Lock body scroll when full menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (href: string, action: "catalogue" | "scroll") => {
    setMenuOpen(false);
    if (action === "catalogue") {
      onOpenCatalogue();
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#FFF9F2]/95 backdrop-blur-md shadow-[0_2px_15px_rgba(62,39,35,0.06)] border-b border-[#E8D8C3]"
            : "bg-[#FFF9F2]/90 backdrop-blur-sm border-b border-[#E8D8C3]/60"
        }`}
      >
        <div className="wrap flex items-center justify-between" style={{ height: 76 }}>
          {/* ── LEFT: Logo Icon + Salon Branding ── */}
          <button
            onClick={() => handleNavClick("#hero", "scroll")}
            aria-label="Poongothai Family Salon — Home"
            className="flex items-center gap-3 text-left leading-none shrink-0 group focus:outline-none"
          >
            {/* Salon Logo Image */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#E8D8C3] bg-[#FAF7F0] shrink-0 shadow-xs">
              <img
                src={SALON_LOGO}
                alt="Poongothai Family Salon Logo"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <span
                className="font-heading font-bold tracking-tight text-[#3E2723] transition-colors"
                style={{ fontSize: "1.2rem", letterSpacing: "-0.01em" }}
              >
                POONGOTHAI
              </span>
              <span
                className="font-body font-semibold tracking-[0.28em] text-[#9A6B52] uppercase mt-0.5"
                style={{ fontSize: "0.58rem" }}
              >
                FAMILY SALON
              </span>
            </div>
          </button>

          {/* ── CENTER: Clean, Spacious Desktop Navigation ── */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-14">
            {CENTER_LINKS.map((item) => {
              const isActive = active === item.href;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href, "scroll")}
                  className="relative text-xs font-body font-semibold tracking-[0.14em] uppercase transition-colors py-2 group"
                  style={{ color: isActive ? "#5C3A2E" : "#7A6152" }}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-[#C6A15B] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* ── RIGHT: [ CONTACT ] Button + MENU ☰ ── */}
          <div className="flex items-center gap-3 sm:gap-3.5 shrink-0">
            {/* Contact CTA button */}
            <button
              onClick={() => handleNavClick("#contact", "scroll")}
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-md font-body font-semibold text-xs tracking-wider uppercase transition-all duration-250 hover:bg-[#5C3A2E] hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "#3E2723",
                color: "#F8F1E7",
                boxShadow: "0 2px 8px rgba(62,39,35,0.18)",
              }}
            >
              CONTACT
            </button>

            {/* Menu Drawer Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-md border transition-all duration-250 group hover:border-[#5C3A2E] hover:bg-[#5C3A2E] hover:text-white"
              style={{
                borderColor: "#E8D8C3",
                background: "#FAF7F0",
                color: "#3E2723",
              }}
              aria-label="Open full menu"
            >
              <span className="text-xs font-body font-bold tracking-[0.18em] uppercase group-hover:text-white transition-colors hidden sm:inline">
                MENU
              </span>
              <MenuIcon className="w-4 h-4 text-[#5C3A2E] group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* ── FULL-SCREEN EDITORIAL NAVIGATION DRAWER ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto"
            style={{ background: "#3E2723" }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar inside Menu Drawer */}
            <div className="wrap w-full flex items-center justify-between" style={{ height: 76 }}>
              {/* Branding with Logo in Menu */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white/10 shrink-0">
                  <img
                    src={SALON_LOGO}
                    alt="Poongothai Family Salon Logo"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="font-heading font-bold tracking-tight text-white" style={{ fontSize: "1.2rem" }}>
                    POONGOTHAI
                  </span>
                  <span className="font-body font-medium tracking-[0.28em] text-[#C6A15B] uppercase mt-0.5" style={{ fontSize: "0.58rem" }}>
                    FAMILY SALON
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <span className="text-xs font-body font-bold tracking-[0.16em] uppercase">CLOSE</span>
                <X className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>

            {/* Menu List */}
            <div className="wrap w-full py-8 md:py-12 my-auto">
              <nav className="flex flex-col max-w-2xl">
                {FULL_MENU_ITEMS.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => handleNavClick(item.href, item.action)}
                    className="group flex items-center justify-between py-3.5 sm:py-4.5 text-left border-b transition-all duration-300 hover:pl-3"
                    style={{ borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-baseline gap-5 sm:gap-8">
                      <span
                        className="font-body font-semibold text-xs tracking-widest transition-colors group-hover:text-[#C6A15B]"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {item.num}
                      </span>
                      <span
                        className="font-heading font-bold text-xl sm:text-3xl lg:text-4xl text-white tracking-wide transition-colors group-hover:text-[#C6A15B]"
                      >
                        {item.label}
                      </span>
                    </div>

                    <ArrowUpRight
                      className="w-5 h-5 sm:w-6 sm:h-6 text-[#C6A15B] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    />
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Menu Footer */}
            <div className="wrap w-full py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-body text-xs text-white/50 text-center sm:text-left">
                Srinivasa Street, 2, 7TH Avenue, Velachery, Chennai • +91 90431 46394
              </p>

              <div className="flex items-center gap-6">
                <a
                  href={`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(contactData.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs font-semibold tracking-wider text-[#C6A15B] hover:underline"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href="tel:+919043146394"
                  className="font-body text-xs font-semibold tracking-wider text-white hover:underline"
                >
                  Call Salon
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
