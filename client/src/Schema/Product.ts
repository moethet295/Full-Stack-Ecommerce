import { z } from "zod";

export const productSchema = z.object({

  // =====================================
  // PRODUCT NAME
  // =====================================

  name: z
    .string()
    .min(3, {
      message:
        "Product name must be at least 3 characters long",
    }),

  // =====================================
  // DESCRIPTION
  // =====================================

  description: z
    .string()
    .min(10, {
      message:
        "Description must be at least 10 characters long",
    }),

  // =====================================
  // PRICE
  // =====================================

  price: z
    .number()
    .min(0, {
      message:
        "Price must be greater than or equal to 0",
    }),

  // =====================================
  // STOCK
  // =====================================

  instock_count: z
    .number()
    .min(0, {
      message:
        "Stock count must be greater than or equal to 0",
    }),

  // =====================================
  // CATEGORY
  // =====================================

  category: z
    .string()
    .min(1, {
      message:
        "Category is required",
    }),

  // =====================================
  // SIZES
  // =====================================

  sizes: z
    .array(
      z.enum([
        "2XL",
        "L",
        "M",
        "S",
        "XL",
        "XXL",
      ])
    )
    .min(1, {
      message:
        "At least one size must be selected",
    }),

  // =====================================
  // COLORS
  // =====================================

  colors: z
    .array(
      z.enum([
        "Beige",
        "Black",
        "Blue",
        "Brown",
        "Charcoal",
        "Cream",
        "Dark Blue",
        "Dark Brown",
        "Green",
        "Grey",
        "Navy",
        "Olive",
        "Pink",
        "Red",
        "White",
      ])
    )
    .min(1, {
      message:
        "At least one color must be selected",
    }),

  // =====================================
  // IMAGES
  // =====================================

  images: z
    .array(
      z.object({

        file: z
          .instanceof(File)
          .optional(),

        preview:
          z.string(),

        url: z
          .string()
          .optional(),

        public_alt: z
          .string()
          .optional(),

      })
    )
    .min(1, {
      message:
        "At least one image is required",
    }),

  // =====================================
  // NEW ARRIVAL
  // =====================================

  is_new_arrival:
    z.boolean(),

  // =====================================
  // FEATURED
  // =====================================

  is_feature:
    z.boolean(),

  // =====================================
  // RATING
  // =====================================

  rating_count: z
    .number()
    .min(0, {
      message:
        "Rating count must be greater than or equal to 0",
    }),

});

export type ProductFormInputs =
  z.infer<typeof productSchema>;