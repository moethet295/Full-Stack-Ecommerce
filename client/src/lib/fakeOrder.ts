import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@/types/order";

// =====================================
// CUSTOMER NAMES
// =====================================

const customerNames: string[] = [
  "Aung Aung",
  "Su Su",
  "Kyaw Kyaw",
  "May Thu",
  "Htet Htet",
  "Min Khant",
  "Thiri",
  "Nandar",
];

// =====================================
// ORDER STATUS
// =====================================

const orderStatuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// =====================================
// PAYMENT STATUS
// =====================================

const paymentStatuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

// =====================================
// PRODUCT NAMES
// =====================================

const productNames: string[] = [
  "Black Hoodie",
  "White T-Shirt",
  "Blue Jeans",
  "Gym Shirt",
  "Classic Shirt",
  "Sport Shorts",
];

// =====================================
// PRODUCT COLORS
// =====================================

const colors: string[] = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Green",
];

// =====================================
// PRODUCT SIZES
// =====================================

const sizes: string[] = [
  "S",
  "M",
  "L",
  "XL",
];

// =====================================
// FAKE ORDER FUNCTION
// =====================================

export const fakeOrder = (
  count: number = 10
): Order[] => {

  const orders: Order[] = [];

  for (
    let index = 0;
    index < count;
    index++
  ) {

    // =================================
    // CUSTOMER
    // =================================

    const customerName =
      customerNames[
        index % customerNames.length
      ];

    // =================================
    // ORDER STATUS
    // =================================

    const orderStatus =
      orderStatuses[
        index % orderStatuses.length
      ];

    // =================================
    // PAYMENT STATUS
    // =================================

    const paymentStatus =
      paymentStatuses[
        index % paymentStatuses.length
      ];

    // =================================
    // PRODUCT
    // =================================

    const productName =
      productNames[
        index % productNames.length
      ];

    const productColor =
      colors[
        index % colors.length
      ];

    const productSize =
      sizes[
        index % sizes.length
      ];

    // =================================
    // PRICE
    // =================================

    const price =
      25 + index * 5;

    // =================================
    // QUANTITY
    // =================================

    const quantity =
      (index % 3) + 1;

    // =================================
    // TOTAL
    // =================================

    const itemsPrice =
      price * quantity;

    const shippingPrice =
      itemsPrice >= 100
        ? 0
        : 5;

    const totalPrice =
      itemsPrice +
      shippingPrice;

    // =================================
    // CREATED DATE
    // =================================

    const createdAt =
      new Date(
        Date.now() -
          index *
            24 *
            60 *
            60 *
            1000
      ).toISOString();

    // =================================
    // ORDER
    // =================================

    orders.push({

      // ===============================
      // ORDER ID
      // ===============================

      _id:
        `ORD-${1001 + index}`,

      // ===============================
      // USER ID
      // ===============================

      userId:
        `fake-user-${index + 1}`,

      // ===============================
      // ORDER ITEMS
      // ===============================

      orderItems: [
        {
          productId:
            `fake-product-${index + 1}`,

          name:
            productName,

          price:
            price,

          image:
            "",

          size:
            productSize,

          color:
            productColor,

          quantity:
            quantity,
        },
      ],

      // ===============================
      // SHIPPING ADDRESS
      // ===============================

      shippingAddress: {

        fullName:
          customerName,

        phone:
          `09${String(
            700000000 +
              index
          )}`,

        address:
          `${index + 1} Main Street`,

        city:
          "Yangon",

        country:
          "Myanmar",

        postalCode:
          "11181",
      },

      // ===============================
      // PAYMENT METHOD
      // ===============================

      paymentMethod:
        "stripe",

      // ===============================
      // PAYMENT STATUS
      // ===============================

      paymentStatus:
        paymentStatus,

      // ===============================
      // ORDER STATUS
      // ===============================

      orderStatus:
        orderStatus,

      // ===============================
      // PRICE
      // ===============================

      itemsPrice:
        itemsPrice,

      shippingPrice:
        shippingPrice,

      totalPrice:
        totalPrice,

      // ===============================
      // STRIPE
      // ===============================

      stripeSessionId:
        `cs_test_fake_${
          index + 1
        }`,

      stripePaymentIntentId:
        `pi_test_fake_${
          index + 1
        }`,

      // ===============================
      // PAYMENT DATE
      // ===============================

      paidAt:
        paymentStatus ===
        "paid"
          ? createdAt
          : undefined,

      // ===============================
      // DELIVERY DATE
      // ===============================

      deliveredAt:
        orderStatus ===
        "delivered"
          ? createdAt
          : undefined,

      // ===============================
      // TIMESTAMPS
      // ===============================

      createdAt:
        createdAt,

      updatedAt:
        createdAt,
    });
  }

  return orders;
};