const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
const GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || "main";

function rawUrl(path: string): string {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}?t=${Date.now()}`;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(rawUrl(path));
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  return res.json();
}

export interface ServiceItem {
  name: string;
  price: number;
  oldPrice?: number;
  offer?: string;
  duration?: string;
}

export interface ServiceSubCategory {
  title: string;
  rows: { label: string; price: string; price2?: string }[];
}

export interface ServiceCategory {
  id: string;
  gender: "men" | "women" | "kids";
  icon: string;
  title: string;
  description: string;
  services: ServiceItem[];
  subCategories?: ServiceSubCategory[];
  imageUrl?: string;
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
  gender: "men" | "women";
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
    rows: { label: string; price: string; price2?: string }[];
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

export interface CatalogueItem {
  GENDER: string;
  SERVICE_NAME: string;
  SERVICE: string;
  TYPE: string;
  PRICE: string;
  "OLD PRICE": string;
  image_url: string;
}

export interface SiteData {
  services: ServiceCategory[];
  packages: Package[];
  mensHairstyles: Hairstyle[];
  womensHairstyles: Hairstyle[];
  bridalCategories: BridalCategory[];
  testimonials: Testimonial[];
  contact: ContactData;
  owner: OwnerData;
  catalogue: CatalogueItem[];
}

let cachedData: SiteData | null = null;
let fetchPromise: Promise<SiteData> | null = null;

export async function fetchSiteData(): Promise<SiteData> {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const [
      services,
      packages,
      hairstyles,
      bridalCategories,
      testimonials,
      contact,
      owner,
      catalogue,
    ] = await Promise.all([
      fetchJson<ServiceCategory[]>("src/data/services.json"),
      fetchJson<Package[]>("src/data/packages.json"),
      fetchJson<{ mensHairstyles: Hairstyle[]; womensHairstyles: Hairstyle[] }>("src/data/hairstyles.json"),
      fetchJson<BridalCategory[]>("src/data/bridalServices.json"),
      fetchJson<Testimonial[]>("src/data/testimonials.json"),
      fetchJson<ContactData>("src/data/contact.json"),
      fetchJson<OwnerData>("src/data/owner.json"),
      fetchJson<CatalogueItem[]>("src/data/catalogue.json"),
    ]);

    const data: SiteData = {
      services,
      packages,
      mensHairstyles: hairstyles.mensHairstyles,
      womensHairstyles: hairstyles.womensHairstyles,
      bridalCategories,
      testimonials,
      contact,
      owner,
      catalogue,
    };

    cachedData = data;
    return data;
  })();

  return fetchPromise;
}
