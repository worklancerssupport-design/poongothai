import { MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon, TwitterIcon } from "./SocialIcons";
import { contactData } from "@/data/contact";

const quickLinks = [
  { label: "Services",           href: "#services"   },
  { label: "Hairstyles",         href: "#hairstyles"  },
  { label: "Bridal",             href: "#bridal"      },
  { label: "Gallery",            href: "#gallery"     },
  { label: "Contact",            href: "#contact"     },
];

const socials = [
  { icon: InstagramIcon, href: contactData.social.instagram, label: "Instagram" },
  { icon: FacebookIcon,  href: contactData.social.facebook,  label: "Facebook"  },
  { icon: YoutubeIcon,   href: contactData.social.youtube,   label: "YouTube"   },
  { icon: TwitterIcon,   href: contactData.social.twitter,   label: "Twitter"   },
];

const hours = [
  { day: "Mon – Fri", time: "9:00 AM – 9:00 PM"  },
  { day: "Saturday",  time: "9:00 AM – 10:00 PM" },
  { day: "Sunday",    time: "10:00 AM – 8:00 PM"  },
];

export default function Footer() {
  const go = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="py-6" style={{ background: "#2B2118", color: "#fff" }}>
      <div className="wrap pt-20 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14">

          {/* ── Brand ── */}
          <div>
            <div className="mb-8">
              {/* <img */}
              {/*   src="/white_logo.svg" */}
              {/*   alt="Poongothai Family Salon" */}
              {/*   width={64} */}
              {/*   height={52} */}
              {/*   className="mb-4" */}
              {/* /> */}
              <p className="font-heading font-bold text-lg text-white leading-none">Poongothai</p>
              <p
                className="font-body text-[10px] tracking-[0.3em] uppercase mt-1"
                style={{ color: "#C6A15B" }}
              >
                Family Salon
              </p>
            </div>
            <p
              className="text-xs font-body leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Premium family hair salon for men &amp; women in Velachery, Chennai.
            </p>
            <div className="pb-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded flex items-center justify-center border transition-all duration-200"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#C6A15B";
                    e.currentTarget.style.color = "#C6A15B";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                  }}
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4
              className="font-body font-semibold text-xs uppercase tracking-widest mb-6"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((l, index) => (
                <li 
                  key={l.href} 
                  className={index === quickLinks.length - 1 ? "pb-4" : ""}
                >
                  <button 
                    onClick={() => go(l.href)} 
                    className="text-xs font-body transition-colors"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4
              className="font-body font-semibold text-xs uppercase tracking-widest mb-6"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Contact
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#C6A15B" }} />
                <span className="text-xs font-body leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Srinivasa Street, 2, 7TH Avenue,<br />
                  Taramani Link Rd, Velachery,<br />
                  Chennai, Tamil Nadu 600042
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: "#C6A15B" }} />
                <a
                  href="tel:+919043146394"
                  className="text-xs font-body transition-colors"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                >
                  90431 46394
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: "#C6A15B" }} />
                <a
                  href={`mailto:${contactData.email}`}
                  className="text-xs font-body transition-colors"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                >
                  {contactData.email}
                </a>
              </li>
            </ul>
          </div>

          {/* ── Hours ── */}
          <div>
            <h4
              className="font-body font-semibold text-xs uppercase tracking-widest mb-6"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Business Hours
            </h4>
            <div className="space-y-4">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <span className="text-xs font-body" style={{ color: "rgba(255,255,255,0.35)" }}>{h.day}</span>
                  <span className="text-xs font-body" style={{ color: "rgba(255,255,255,0.6)" }}>{h.time}</span>
                </div>
              ))}
            </div>

            {/* Open indicator */}
            <div className="mt-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
              <span className="text-xs font-body" style={{ color: "rgba(255,255,255,0.4)" }}>
                Open today until 9:00 PM
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body" style={{ color: "rgba(255,255,255,0.22)" }}>
            © {new Date().getFullYear()} Poongothai Family Salon. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service"].map((t) => (
              <a
                key={t}
                href="#"
                className="text-xs font-body transition-colors"
                style={{ color: "rgba(255,255,255,0.22)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
