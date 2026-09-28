export interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  images: string[];
  stock: number;
  color: string;
  colorHex: string;
  sizes?: string[];
  specifications: Spec[];
  reviews: Review[];
  relatedIds: number[];
}

export interface CartItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  color: string;
  size?: string;
  quantity: number;
  stock: number;
}