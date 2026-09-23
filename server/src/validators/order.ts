import { z } from "zod";

// =====================================
// MONGODB OBJECT ID
// =====================================

const objectIdRegex =
  /^[0-9a-fA-F]{24}$/;

// =====================================
// ORDER ITEM
// =====================================

export const orderItemSchema =
  z.object({

    productId:
      z
        .string()
        .regex(
          objectIdRegex,
          "Invalid product ID"
        ),

    name:
      z
        .string()
        .min(
          1,
          "Product name is required"
        ),

    price:
      z
        .number()
        .min(
          0,
          "Price cannot be negative"
        ),

    image:
      z
        .string()
        .optional()
        .default(""),

    size:
      z
        .string()
        .min(
          1,
          "Size is required"
        ),

    color:
      z
        .string()
        .min(
          1,
          "Color is required"
        ),

    quantity:
      z
        .number()
        .int()
        .min(
          1,
          "Quantity must be at least 1"
        ),
  });

// =====================================
// SHIPPING ADDRESS
// =====================================

export const shippingAddressSchema =
  z.object({

    fullName:
      z
        .string()
        .min(
          2,
          "Full name is required"
        ),

    phone:
      z
        .string()
        .min(
          5,
          "Phone number is required"
        ),

    address:
      z
        .string()
        .min(
          5,
          "Address is required"
        ),

    city:
      z
        .string()
        .min(
          2,
          "City is required"
        ),

    country:
      z
        .string()
        .min(
          2,
          "Country is required"
        ),

    postalCode:
      z
        .string()
        .optional(),
  });

// =====================================
// CREATE CHECKOUT SESSION
// =====================================

export const createCheckoutSchema =
  z.object({

    cartItems:
      z
        .array(
          orderItemSchema
        )
        .min(
          1,
          "Cart is empty"
        ),

    shippingAddress:
      shippingAddressSchema
        .optional(),
  });

// =====================================
// CREATE ORDER
// =====================================

export const createOrderSchema =
  z.object({

    orderItems:
      z
        .array(
          orderItemSchema
        )
        .min(
          1,
          "Order must contain at least one product"
        ),

    shippingAddress:
      shippingAddressSchema,

    paymentMethod:
      z
        .literal(
          "stripe"
        )
        .default(
          "stripe"
        ),
  });

// =====================================
// UPDATE ORDER STATUS
// =====================================

export const updateOrderStatusSchema =
  z.object({

    orderStatus:
      z.enum([
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ]),
  });

// =====================================
// TYPES
// =====================================

export type CreateCheckoutInput =
  z.infer<
    typeof createCheckoutSchema
  >;

export type CreateOrderInput =
  z.infer<
    typeof createOrderSchema
  >;

export type UpdateOrderStatusInput =
  z.infer<
    typeof updateOrderStatusSchema
  >;