export interface ServiceItem {
  name: string;
  price: number;
  oldPrice?: number;
  offer?: string;
  bridalPrice?: string;
}

export interface ServiceSubCategory {
  title: string;
  rows: { label: string; price: string; price2?: string; type?: string }[];
}

export interface ServiceCategory {
  id: string;
  gender: "men" | "women" | "kids";
  title: string;
  description: string;
  services: ServiceItem[];
  subCategories?: ServiceSubCategory[];
  bridal?: boolean;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  includes: string[];
  oldPrice: number;
  newPrice: number;
  savings: number;
  tag?: string;
  popular?: boolean;
  gender: "men" | "women";
}

export interface Hairstyle {
  id: string;
  name: string;
  description: string;
  image: string;
  gender: "men" | "women" | "kids";
  tags: string[];
  bestFor: string;
  maintenance: "Low" | "Medium" | "High";
  time: string;
  price?: string;
  oldPrice?: string;
  suitableHair?: string;
}

export interface BridalCategory {
  id: string;
  title: string;
  icon: string;
  services: { name: string; price: string; note?: string }[];
  subCategories?: {
    title: string;
    brands?: string[];
  rows: { label: string; price: string; price2?: string; type?: string }[];
  }[];
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  verified: boolean;
}

export interface ContactData {
  address: { full: string };
  phone: { primary: string };
  email: string;
  whatsapp: string;
  whatsappMessage: string;
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
}

export interface ShopImage {
  src: string;
  alt: string;
  title: string;
}

export interface OwnerData {
  name: string;
  title: string;
  experience: string;
  photo: string;
  description: string;
  awards: string[];
  shopImages: ShopImage[];
  shopSpaceDescription: string;
  meetTheExpertDescription: string;
}

export interface SiteData {
  services: ServiceCategory[];
  packages: Package[];
  mens: Hairstyle[];
  womens: Hairstyle[];
  kids: Hairstyle[];
  bridalCategories: BridalCategory[];
  testimonials: Testimonial[];
  contact: ContactData;
  owner: OwnerData;
}

import servicesData from "@/data/services.json";
import packagesData from "@/data/packages.json";
import hairstylesData from "@/data/hairstyles.json";
import testimonialsData from "@/data/testimonials.json";
import contactData from "@/data/contact.json";
import ownerData from "@/data/owner.json";

const BRIDAL_ID_MAP: Record<string, string> = {
  "women-straightening": "hair-styling",
  "women-makeup": "makeup",
  "women-massage": "body-care",
  "women-other": "beauty",
  "women-bleach": "bleach",
  "women-detan": "detan",
  "women-cleanup": "cleanup",
  "women-threading": "threading",
  "women-waxing": "waxing",
};

function deriveBridalCategories(services: ServiceCategory[]): BridalCategory[] {
  return services
    .filter((cat) => cat.gender === "women" && cat.bridal)
    .map((cat) => ({
      id: BRIDAL_ID_MAP[cat.id] ?? cat.id,
      title: cat.title,
      icon: "",
      services: cat.services.map((s) => ({
        name: s.name,
        price: s.bridalPrice ?? `₹${s.price.toLocaleString("en-IN")}`,
      })),
      subCategories: cat.subCategories?.map((sub) => ({
        title: sub.title,
        rows: sub.rows.map((r) => ({
          label: r.label,
          price: r.price,
          price2: r.price2,
          type: r.type,
        })),
      })),
    }));
}

export function loadLocalData(): SiteData {
  const services = servicesData as ServiceCategory[];
  return {
    services,
    packages: packagesData as Package[],
    mens: (hairstylesData as { mens: Hairstyle[] }).mens,
    womens: (hairstylesData as { womens: Hairstyle[] }).womens,
    kids: (hairstylesData as { kids: Hairstyle[] }).kids,
    bridalCategories: deriveBridalCategories(services),
    testimonials: testimonialsData as Testimonial[],
    contact: contactData as ContactData,
    owner: ownerData as OwnerData,
  };
}
