export interface ProductImage {
  url: string;
  public_alt?: string;
}

export interface Product {
  _id: string;

  name: string;

  description: string;

  price: number;

  instock_count: number;

  category: string;

  sizes: string[];

  colors: string[];

  images: ProductImage[];

  is_new_arrival: boolean;

  is_feature: boolean;

  rating_count: number;

  // MongoDB timestamps
  createdAt: string;

  updatedAt: string;
}

// =====================================
// Product Meta API ကပြန်လာမယ့် data
// =====================================

export interface ProductMeta {
  colors: string[];

  sizes: string[];

  minPrice: number | null;

  maxPrice: number | null;

  keyword: string;

  category: string;
}

// =====================================
// Product filter query
// =====================================

export interface ProductFilters {
  keyword?: string;

  category?: string;

  minPrice?: string;

  maxPrice?: string;

  sizes?: string[];

  colors?: string[];

  sortBy?: string;
}