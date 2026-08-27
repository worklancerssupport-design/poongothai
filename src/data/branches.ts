export interface BranchImage {
  src: string;
  alt: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  cover: string;
  images: BranchImage[];
}

export const branchesData: Branch[] = [
  {
    id: "venus-colony-ext",
    name: "Venus Colony Ext.",
    location: "Star Family Beauty Salon, No.13, Near, 3rd St, Venus Colony, Velachery, Chennai, Tamil Nadu 600042",
    cover: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=80", alt: "Venus Colony branch interior" },
      { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&q=80", alt: "Styling station" },
      { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000&q=80", alt: "Reception area" },
      { src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1000&q=80", alt: "Wash stations" },
    ],
  },
  {
    id: "vgp-seethapathy-nagar",
    name: "VGP Seethapathy Nagar",
    location: "Murphu7Star Men's Salon, No 5 murphy, Dass Ave, VGP Seethapathy Nagar, Velachery, Chennai, Tamil Nadu 600042",
    cover: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&q=80", alt: "VGP Seethapathy Nagar branch" },
      { src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1000&q=80", alt: "Hair styling in progress" },
      { src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1000&q=80", alt: "Men's grooming" },
      { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1000&q=80", alt: "Fade haircut" },
    ],
  },
  {
    id: "iit-m-campus",
    name: "IIT-M Campus",
    location: "7Star Unisex Salon, N0:4 SFC Near Gurunath Store Near Canara Bank ATM IIT CAMPUS, Chennai, Tamil Nadu 600036",
    cover: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=1000&q=80", alt: "IIT-M branch exterior" },
      { src: "https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=1000&q=80", alt: "Colour treatment" },
      { src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1000&q=80", alt: "Balayage in progress" },
      { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1000&q=80", alt: "Hair transformation" },
    ],
  },
  {
    id: "iitm-shopping-complex",
    name: "IIT-M Shopping Complex",
    location: "7 STAR LADIES BEAUTY SALOON, Shopping Center, Shop No.207, IIT.M",
    cover: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
    images: [
      { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&q=80", alt: "IITM Shopping Complex branch" },
      { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1000&q=80", alt: "Bridal makeup" },
      { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1000&q=80", alt: "Reception look" },
      { src: "https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=1000&q=80", alt: "Colour service" },
    ],
  },
];
