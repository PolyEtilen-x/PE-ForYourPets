export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  specs?: Record<string, string[]>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
