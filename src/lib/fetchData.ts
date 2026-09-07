export interface ServiceItem {
  name: string;
  price: number;
  oldPrice?: number;
  offer?: string;
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
}

export interface Package {
  id: string;
  title: string;
  image: string;
  description: string;
  includes: string[];
  oldPrice: number;
  newPrice: number;
  savings: number;
  tag?: string;
  popular?: boolean;
  gender: "men" | "women" | "couple" | "bridal";
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

export interface OwnerData {
  name: string;
  title: string;
  experience: string;
  photo: string;
  description: string;
  awards: string[];
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
import bridalServicesData from "@/data/bridalServices.json";
import testimonialsData from "@/data/testimonials.json";
import contactData from "@/data/contact.json";
import ownerData from "@/data/owner.json";

export function loadLocalData(): SiteData {
  return {
    services: servicesData as ServiceCategory[],
    packages: packagesData as Package[],
    mens: (hairstylesData as { mens: Hairstyle[] }).mens,
    womens: (hairstylesData as { womens: Hairstyle[] }).womens,
    kids: (hairstylesData as { kids: Hairstyle[] }).kids,
    bridalCategories: bridalServicesData as BridalCategory[],
    testimonials: testimonialsData as Testimonial[],
    contact: contactData as ContactData,
    owner: ownerData as OwnerData,
  };
}
