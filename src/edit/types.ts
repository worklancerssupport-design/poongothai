export interface CatalogueItem {
  GENDER: string;
  SERVICE_NAME: string;
  SERVICE: string;
  TYPE: string;
  PRICE: string;
  "OLD PRICE": string;
  image_url: string;
}

export type CatalogueData = CatalogueItem[];

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

export interface HairstylesData {
  mens: Hairstyle[];
  womens: Hairstyle[];
}
