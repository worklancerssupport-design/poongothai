import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Phone, Mail, MessageCircle, MapPin, ArrowRight } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon, WhatsAppIcon } from "./SocialIcons";
import { useDataContext } from "@/contexts/DataContext";

export default function Contact() {
  const { contact: contactData } = useDataContext();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const channels = [
    {
      icon: Phone,
      label: "Direct Line",
      value: contactData.phone.primary,
      href: `tel:+919043146394`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp Chat",
      value: "90431 46394",
      href: `https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(contactData.whatsappMessage)}`,
    },
    {
      icon: Mail,
      label: "Email Enquiries",
      value: contactData.email,
      href: `mailto:${contactData.email}`,
    },
    {
      icon: MapPin,
      label: "Salon Studio",
      value: "Velachery, Chennai — 600042",
      href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactData.address.full)}`,
    },
  ];

  const socials = [
    { icon: InstagramIcon, href: contactData.social.instagram, label: "Instagram" },
    { icon: FacebookIcon,  href: contactData.social.facebook,  label: "Facebook"  },
    { icon: YoutubeIcon,   href: contactData.social.youtube,   label: "YouTube"   },
    { icon: WhatsAppIcon,  href: `https://wa.me/${contactData.whatsapp}`, label: "WhatsApp" },
  ];

  return (
    <section id="contact" className="section relative overflow-hidden" style={{ background: "#FFF9F2" }}>
      {/* Background watermark */}
      <div
        className="absolute left-1/2 -top-10 -translate-x-1/2 font-heading font-bold select-none pointer-events-none opacity-5 leading-none hidden lg:block"
        style={{ fontSize: "clamp(8rem, 16vw, 14rem)", color: "#5C3A2E" }}
      >
        CONTACT
      </div>

      <div className="wrap relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-6 h-px" style={{ background: "#C6A15B" }} />
            <span className="label">Get In Touch</span>
          </div>
          <h2
            className="font-heading font-bold"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#3E2723", letterSpacing: "-0.03em" }}
          >
            LET&apos;S TALK STYLE.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column (6 cols) — Contact channels */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6 flex flex-col justify-between"
          >
            <div>
              <p className="font-body text-sm leading-relaxed mb-10 max-w-md" style={{ color: "#7A6152" }}>
                Whether you need a quick haircut, a full bridal consultation, or simply want to inquire about our services — our team is always ready to assist you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {channels.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.label.includes("WhatsApp") || c.label.includes("Salon") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="p-5 rounded-xl border transition-all duration-300 group hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                    style={{ border: "1px solid #E8D8C3", background: "#fff" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors"
                      style={{ background: "#F8F1E7" }}
                    >
                      <c.icon className="w-4 h-4" style={{ color: "#5C3A2E" }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-body uppercase tracking-wider mb-1" style={{ color: "#9A6B52" }}>
                        {c.label}
                      </p>
                      <p className="text-sm font-body font-medium transition-colors group-hover:underline" style={{ color: "#2B2118" }}>
                        {c.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="pt-6 border-t" style={{ borderColor: "#E8D8C3" }}>
              <p className="text-[10px] font-body uppercase tracking-widest mb-4" style={{ color: "#9A6B52" }}>
                Follow Along
              </p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200"
                    style={{ borderColor: "#E8D8C3", color: "#7A6152", background: "#fff" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#5C3A2E";
                      e.currentTarget.style.color = "#5C3A2E";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#E8D8C3";
                      e.currentTarget.style.color = "#7A6152";
                    }}
                  >
                    <s.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column (6 cols) — WhatsApp Quick Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-12 rounded-2xl shadow-xl"
            style={{
              background: "#3E2723",
              border: "1px solid rgba(198,161,91,0.25)",
            }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: "#C6A15B" }} />
                <span className="label" style={{ color: "#C6A15B" }}>Fast Booking</span>
              </div>

              <h3
                className="font-heading font-bold text-white mb-4"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.15 }}
              >
                Instant Confirmation via WhatsApp
              </h3>

              <p className="font-body text-sm leading-relaxed mb-8" style={{ color: "rgba(248,241,231,0.72)" }}>
                Chat with our front desk directly for real-time slot availability, special package consultations, or personalized stylist appointments.
              </p>

              <div className="space-y-3.5 mb-10">
                {[
                  "Average response time: under 5 minutes",
                  "Direct appointment slot booking",
                  "Custom hair & bridal package queries",
                  "Personalized stylist consultation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C6A15B" }} />
                    <span className="font-body text-xs" style={{ color: "rgba(248,241,231,0.85)" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(contactData.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 py-4 px-8 rounded-md font-body font-medium text-sm text-white transition-all duration-300 shadow-lg"
              style={{ background: "#5C3A2E", border: "1px solid rgba(198,161,91,0.3)" }}
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              Chat on WhatsApp
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: "#C6A15B" }} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
