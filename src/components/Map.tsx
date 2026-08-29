import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Navigation, MessageCircle } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";

export default function Map() {
  const { contact: contactData } = useDataContext();
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="map" className="section relative" style={{ background: "#F8F1E7" }}>
      <div className="wrap">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (5 cols) — Info & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px" style={{ background: "#C6A15B" }} />
              <span className="label">Location</span>
            </div>

            <h2
              className="font-heading font-bold mb-6"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", color: "#3E2723", letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              COME
              <br />
              <span style={{ color: "#5C3A2E" }}>FIND</span> US.
            </h2>

            <p className="font-body text-sm mb-10" style={{ color: "#7A6152", lineHeight: 1.8 }}>
              Visit our premium salon in Velachery for a bespoke styling session. Walk-ins and prior bookings are both warmly welcomed.
            </p>

            {/* Information Rows */}
            <div className="space-y-6 mb-10">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#F0E6D8", border: "1px solid #E8D8C3" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "#5C3A2E" }} />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#9A6B52" }}>
                    Address
                  </p>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "#2B2118" }}>
                    Srinivasa Street, 2, 7TH Avenue,<br />
                    Taramani Link Rd, Velachery,<br />
                    Chennai, Tamil Nadu 600042
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#F0E6D8", border: "1px solid #E8D8C3" }}
                >
                  <Phone className="w-4 h-4" style={{ color: "#5C3A2E" }} />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#9A6B52" }}>
                    Phone
                  </p>
                  <a
                    href="tel:+919043146394"
                    className="font-body text-sm font-medium hover:underline"
                    style={{ color: "#2B2118" }}
                  >
                    90431 46394
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "#F0E6D8", border: "1px solid #E8D8C3" }}
                >
                  <Mail className="w-4 h-4" style={{ color: "#5C3A2E" }} />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#9A6B52" }}>
                    Email
                  </p>
                  <a
                    href="mailto:ramchandran323@gmail.com"
                    className="font-body text-sm font-medium hover:underline"
                    style={{ color: "#2B2118" }}
                  >
                    ramchandran323@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactData.address.full)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn inline-flex items-center gap-2.5"
                style={{ borderRadius: 3 }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>

              <a
                href={`https://wa.me/${contactData.whatsapp}?text=${encodeURIComponent(contactData.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2"
                style={{ borderRadius: 3 }}
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right Column (7 cols) — Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-7 overflow-hidden rounded-2xl shadow-xl"
            style={{
              height: "480px",
              border: "1px solid #E8D8C3",
              background: "#F0E6D8",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0123456789!2d80.2182!3d12.9780!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c9a1234abcd%3A0x5678ef901234abcd!2sVelachery%2C%20Chennai%2C%20Tamil%20Nadu%20600042!5e0!3m2!1sen!2sin!4v1693000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Poongothai Family Salon Location — Velachery, Chennai"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
