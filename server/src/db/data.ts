import mongoose from "mongoose";

const userId = new mongoose.Types.ObjectId("68add60b0013521e949e5f46");

export const products = [
  {
    name: "Midnight Vibe Black Tee",
    description:
      "A sleek oversized black t-shirt made for comfort and street style. Perfect for casual wear or layering.",
    category: "t-shirt",
    colors: ["Black", "Charcoal", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    price: 70,
    instock_count: 25,
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        public_alt: "Black T-Shirt Front",
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        public_alt: "Black T-Shirt Back",
      },
    ],
    is_new_arrival: true,
    is_feature: false,
    rating_count: 4.8,
    userId,
  },

  {
    name: "Modern Beige Jacket",
    description:
      "Stylish beige jacket with a modern design for daily wear and casual outings.",
    category: "Jackets",
    colors: ["Beige", "Brown"],
    sizes: ["M", "L", "XL"],
    price: 120,
    instock_count: 20,
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        public_alt: "Modern Beige Jacket",
      },
      {
        url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
        public_alt: "Beige Jacket Side",
      },
    ],
    is_new_arrival: true,
    is_feature: true,
    rating_count: 4.7,
    userId,
  },

  {
    name: "Urban White Oversized Shirt",
    description:
      "Clean oversized white shirt with a relaxed fit for modern everyday fashion.",
    category: "Shirts",
    colors: ["White", "Cream"],
    sizes: ["S", "M", "L", "XL"],
    price: 85,
    instock_count: 35,
    images: [
      {
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        public_alt: "White Oversized Shirt",
      },
      {
        url: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
        public_alt: "White Shirt Back",
      },
    ],
    is_new_arrival: true,
    is_feature: false,
    rating_count: 4.6,
    userId,
  },

  {
    name: "Classic Blue Denim Jeans",
    description:
      "Classic blue denim jeans with a comfortable straight fit and timeless design.",
    category: "Jeans",
    colors: ["Blue", "Dark Blue"],
    sizes: ["30", "32", "34", "36"],
    price: 110,
    instock_count: 28,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d",
        public_alt: "Blue Denim Jeans",
      },
      {
        url: "https://images.unsplash.com/photo-1475178626620-a4d074967452",
        public_alt: "Denim Jeans Back",
      },
    ],
    is_new_arrival: false,
    is_feature: true,
    rating_count: 4.9,
    userId,
  },

  {
    name: "Street Black Hoodie",
    description:
      "Premium oversized hoodie designed for streetwear lovers and everyday comfort.",
    category: "Hoodies",
    colors: ["Black", "Grey"],
    sizes: ["M", "L", "XL", "XXL"],
    price: 95,
    instock_count: 40,
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
        public_alt: "Black Hoodie Front",
      },
      {
        url: "https://images.unsplash.com/photo-1578681994506-b8f463449011",
        public_alt: "Black Hoodie Back",
      },
    ],
    is_new_arrival: true,
    is_feature: true,
    rating_count: 4.8,
    userId,
  },

  {
    name: "Vintage Brown Leather Jacket",
    description:
      "Premium vintage-inspired leather jacket with a bold and stylish appearance.",
    category: "Jackets",
    colors: ["Brown", "Dark Brown"],
    sizes: ["M", "L", "XL"],
    price: 180,
    instock_count: 12,
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        public_alt: "Brown Leather Jacket",
      },
      {
        url: "https://images.unsplash.com/photo-1520975958225-47d3c5f4e4e8",
        public_alt: "Leather Jacket Side",
      },
    ],
    is_new_arrival: false,
    is_feature: true,
    rating_count: 4.9,
    userId,
  },

  {
    name: "Minimal White Sneakers",
    description:
      "Minimal white sneakers with a clean design that matches almost any outfit.",
    category: "Shoes",
    colors: ["White", "Black"],
    sizes: ["39", "40", "41", "42", "43"],
    price: 140,
    instock_count: 22,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        public_alt: "White Sneakers Front",
      },
      {
        url: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3",
        public_alt: "White Sneakers Side",
      },
    ],
    is_new_arrival: true,
    is_feature: true,
    rating_count: 4.7,
    userId,
  },

  {
    name: "Relaxed Fit Grey Sweatpants",
    description:
      "Soft relaxed-fit sweatpants designed for maximum comfort and casual styling.",
    category: "Pants",
    colors: ["Grey", "Black"],
    sizes: ["S", "M", "L", "XL"],
    price: 75,
    instock_count: 30,
    images: [
      {
        url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea",
        public_alt: "Grey Sweatpants",
      },
      {
        url: "https://images.unsplash.com/photo-1580906855281-0c5b8b3c8c6a",
        public_alt: "Grey Sweatpants Side",
      },
    ],
    is_new_arrival: false,
    is_feature: false,
    rating_count: 4.5,
    userId,
  },

  {
    name: "Elegant Women's Summer Dress",
    description:
      "Lightweight and elegant summer dress with a beautiful modern silhouette.",
    category: "Dresses",
    colors: ["Pink", "White", "Blue"],
    sizes: ["S", "M", "L"],
    price: 130,
    instock_count: 18,
    images: [
      {
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        public_alt: "Women's Summer Dress",
      },
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        public_alt: "Summer Dress Side",
      },
    ],
    is_new_arrival: true,
    is_feature: true,
    rating_count: 4.8,
    userId,
  },

  {
    name: "Classic Navy Baseball Cap",
    description:
      "Classic adjustable baseball cap with a clean design for everyday outfits.",
    category: "Accessories",
    colors: ["Navy", "Black", "White"],
    sizes: ["Free Size"],
    price: 35,
    instock_count: 50,
    images: [
      {
        url: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
        public_alt: "Navy Baseball Cap",
      },
      {
        url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b",
        public_alt: "Baseball Cap Side",
      },
    ],
    is_new_arrival: false,
    is_feature: false,
    rating_count: 4.4,
    userId,
  },

  {
    name: "Premium Green Bomber Jacket",
    description:
      "Modern green bomber jacket with a comfortable fit and premium finish.",
    category: "Jackets",
    colors: ["Green", "Olive", "Black"],
    sizes: ["M", "L", "XL"],
    price: 150,
    instock_count: 16,
    images: [
      {
        url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
        public_alt: "Green Bomber Jacket",
      },
      {
        url: "https://images.unsplash.com/photo-1548883354-7622d03aca27",
        public_alt: "Green Jacket Side",
      },
    ],
    is_new_arrival: true,
    is_feature: false,
    rating_count: 4.6,
    userId,
  },
];