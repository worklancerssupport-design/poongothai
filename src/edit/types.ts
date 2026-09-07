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

export interface HairstylesData {
  mens: Hairstyle[];
  womens: Hairstyle[];
  kids: Hairstyle[];
}
