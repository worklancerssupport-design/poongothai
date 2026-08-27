export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "haircuts" | "bridal" | "colour" | "kids" | "interior" | "before-after";
  aspectRatio?: "portrait" | "landscape" | "square";
}

export const galleryData: GalleryItem[] = [
  // Salon Interior
  {
    id: "int-1",
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80",
    alt: "Premium salon interior with modern styling chairs",
    category: "interior",
    aspectRatio: "landscape",
  },
  {
    id: "int-2",
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    alt: "Elegant reception area",
    category: "interior",
    aspectRatio: "portrait",
  },
  {
    id: "int-3",
    src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
    alt: "Luxury wash stations",
    category: "interior",
    aspectRatio: "landscape",
  },
  {
    id: "int-4",
    src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80",
    alt: "Premium product display",
    category: "interior",
    aspectRatio: "square",
  },
  // Haircuts
  {
    id: "cut-1",
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    alt: "Men's precision fade haircut",
    category: "haircuts",
    aspectRatio: "portrait",
  },
  {
    id: "cut-2",
    src: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&q=80",
    alt: "Women's layer cut styling",
    category: "haircuts",
    aspectRatio: "portrait",
  },
  {
    id: "cut-3",
    src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
    alt: "Elegant blowout finish",
    category: "haircuts",
    aspectRatio: "landscape",
  },
  {
    id: "cut-4",
    src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80",
    alt: "High fade cut in progress",
    category: "haircuts",
    aspectRatio: "portrait",
  },
  {
    id: "cut-5",
    src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
    alt: "Stylish undercut with design",
    category: "haircuts",
    aspectRatio: "square",
  },
  {
    id: "cut-6",
    src: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=600&q=80",
    alt: "French crop with texture",
    category: "haircuts",
    aspectRatio: "portrait",
  },
  // Bridal
  {
    id: "bri-1",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
    alt: "Stunning bridal hairstyle",
    category: "bridal",
    aspectRatio: "portrait",
  },
  {
    id: "bri-2",
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    alt: "Bridal makeup close-up",
    category: "bridal",
    aspectRatio: "landscape",
  },
  {
    id: "bri-3",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
    alt: "Elegant bridal updo",
    category: "bridal",
    aspectRatio: "portrait",
  },
  {
    id: "bri-4",
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80",
    alt: "Bridal reception look",
    category: "bridal",
    aspectRatio: "portrait",
  },
  // Hair Colour
  {
    id: "col-1",
    src: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600&q=80",
    alt: "Vibrant balayage color treatment",
    category: "colour",
    aspectRatio: "portrait",
  },
  {
    id: "col-2",
    src: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&q=80",
    alt: "Ombre hair transformation",
    category: "colour",
    aspectRatio: "portrait",
  },
  {
    id: "col-3",
    src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
    alt: "Premium highlights application",
    category: "colour",
    aspectRatio: "landscape",
  },
  {
    id: "col-4",
    src: "https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=600&q=80",
    alt: "Rich brunette color result",
    category: "colour",
    aspectRatio: "portrait",
  },
  // Kids
  {
    id: "kid-1",
    src: "https://images.unsplash.com/photo-1534308143481-c55f00be0bd7?w=600&q=80",
    alt: "Fun kids haircut experience",
    category: "kids",
    aspectRatio: "portrait",
  },
  {
    id: "kid-2",
    src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80",
    alt: "Cute kids styling session",
    category: "kids",
    aspectRatio: "landscape",
  },
  // Before & After
  {
    id: "ba-1",
    src: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=600&q=80",
    alt: "Hair transformation before and after",
    category: "before-after",
    aspectRatio: "landscape",
  },
  {
    id: "ba-2",
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Color transformation result",
    category: "before-after",
    aspectRatio: "portrait",
  },
];
