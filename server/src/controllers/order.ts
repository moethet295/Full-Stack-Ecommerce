import {
  Request,
  Response,
} from "express";

import Stripe from "stripe";

import mongoose from "mongoose";

import {
  Order,
} from "../models/order";

// =====================================
// STRIPE SECRET KEY
// =====================================

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing in .env"
  );
}

// =====================================
// STRIPE
// =====================================

const stripe =
  new Stripe(
    stripeSecretKey
  );

// =====================================
// CHECKOUT ITEM TYPE
// =====================================

interface CheckoutItem {
  key?: string;

  productId: string;

  name: string;

  price: number;

  image?: string;

  size: string;

  color: string;

  quantity: number;
}

// =====================================
// ORDER STATUS TYPE
// =====================================

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// =====================================
// STRIPE IMAGE
// =====================================

const getStripeImage = (
  imageUrl?: string
): string | undefined => {

  if (!imageUrl) {
    return undefined;
  }

  // ===================================
  // CLOUDINARY RESIZE
  // ===================================

  if (
    imageUrl.includes(
      "res.cloudinary.com"
    ) &&
    imageUrl.includes(
      "/upload/"
    )
  ) {

    return imageUrl.replace(
      "/upload/",
      "/upload/w_120,h_120,c_fill,q_auto,f_auto/"
    );
  }

  return imageUrl;
};

// =====================================
// CREATE CHECKOUT SESSION
// =====================================

export const createCheckoutSession =
  async (
    req: Request,
    res: Response
  ) => {

    let pendingOrderId:
      mongoose.Types.ObjectId | null =
      null;

    try {

      // =================================
      // CART ITEMS
      // =================================

      const {
        cartItems,
      }: {
        cartItems:
          CheckoutItem[];
      } =
        req.body;

      // =================================
      // CHECK CART
      // =================================

      if (
        !cartItems ||
        !Array.isArray(
          cartItems
        ) ||
        cartItems.length === 0
      ) {

        res.status(400).json({
          message:
            "Cart is empty",
        });

        return;
      }

      // =================================
      // VALIDATE ITEMS
      // =================================

      const invalidItem =
        cartItems.find(
          (item) =>
            !item.productId ||
            !mongoose.Types
              .ObjectId
              .isValid(
                item.productId
              ) ||
            !item.name ||
            typeof item.price !==
              "number" ||
            item.price <= 0 ||
            typeof item.quantity !==
              "number" ||
            !Number.isInteger(
              item.quantity
            ) ||
            item.quantity <= 0
        );

      if (invalidItem) {

        res.status(400).json({
          message:
            "Invalid cart item",
        });

        return;
      }

      // =================================
      // ITEMS PRICE
      // =================================

      const itemsPrice =
        cartItems.reduce(
          (
            total,
            item
          ) => {

            return (
              total +
              item.price *
                item.quantity
            );
          },
          0
        );

      // =================================
      // SHIPPING PRICE
      // =================================

      const shippingPrice =
        0;

      // =================================
      // TOTAL PRICE
      // =================================

      const totalPrice =
        itemsPrice +
        shippingPrice;

      // =================================
      // CREATE PENDING ORDER FIRST
      // =================================

      const pendingOrder =
        await Order.create({

          orderItems:
            cartItems.map(
              (item) => ({

                productId:
                  new mongoose
                    .Types
                    .ObjectId(
                      item.productId
                    ),

                name:
                  item.name,

                price:
                  item.price,

                image:
                  item.image ||
                  "",

                size:
                  item.size,

                color:
                  item.color,

                quantity:
                  item.quantity,
              })
            ),

          paymentMethod:
            "stripe",

          paymentStatus:
            "pending",

          orderStatus:
            "pending",

          itemsPrice,

          shippingPrice,

          totalPrice,
        });

      pendingOrderId =
        pendingOrder._id as
          mongoose.Types.ObjectId;

      // =================================
      // STRIPE LINE ITEMS
      // =================================

      const lineItems:
        Stripe.Checkout.SessionCreateParams.LineItem[] =
        cartItems.map(
          (item) => {

            const stripeImage =
              getStripeImage(
                item.image
              );

            return {

              price_data: {

                currency:
                  "usd",

                product_data: {

                  name:
                    item.name,

                  description:
                    `Size: ${
                      item.size ||
                      "N/A"
                    } | Color: ${
                      item.color ||
                      "N/A"
                    }`,

                  ...(stripeImage
                    ? {
                        images: [
                          stripeImage,
                        ],
                      }
                    : {}),
                },

                unit_amount:
                  Math.round(
                    item.price *
                      100
                  ),
              },

              quantity:
                item.quantity,
            };
          }
        );

      // =================================
      // CLIENT URL
      // =================================

      const clientUrl =
        process.env.CLIENT_URL ||
        "http://localhost:5173";

      // =================================
      // CREATE STRIPE SESSION
      // =================================

      const session =
        await stripe
          .checkout
          .sessions
          .create({

            mode:
              "payment",

            payment_method_types: [
              "card",
            ],

            line_items:
              lineItems,

            customer_creation:
              "always",

            billing_address_collection:
              "required",

            phone_number_collection: {
              enabled:
                true,
            },

            // =============================
            // ONLY ORDER ID IN METADATA
            // =============================

            metadata: {

              orderId:
                pendingOrder._id
                  .toString(),
            },

            success_url:
              `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

            cancel_url:
              `${clientUrl}/payment-cancel`,
          });

      // =================================
      // CHECK SESSION URL
      // =================================

      if (!session.url) {

        await Order.findByIdAndDelete(
          pendingOrder._id
        );

        res.status(500).json({
          message:
            "Stripe checkout URL was not created",
        });

        return;
      }

      // =================================
      // SAVE STRIPE SESSION ID
      // =================================

      pendingOrder.stripeSessionId =
        session.id;

      await pendingOrder.save();

      // =================================
      // RESPONSE
      // =================================

      res.status(200).json({

        success:
          true,

        orderId:
          pendingOrder._id,

        sessionId:
          session.id,

        url:
          session.url,
      });

    } catch (error) {

      // =================================
      // CLEAN UP PENDING ORDER
      // IF STRIPE SESSION CREATION FAILED
      // =================================

      if (pendingOrderId) {

        try {

          await Order.findByIdAndDelete(
            pendingOrderId
          );

        } catch (
          cleanupError
        ) {

          console.error(
            "PENDING ORDER CLEANUP ERROR:",
            cleanupError
          );
        }
      }

      console.error(
        "STRIPE CHECKOUT ERROR:",
        error
      );

      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to create Stripe checkout session",
      });
    }
  };

// =====================================
// GET / VERIFY CHECKOUT SESSION
// =====================================

export const getCheckoutSession =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      // =================================
      // SESSION ID
      // =================================

      const sessionId =
        req.params.sessionId;

      if (
        !sessionId ||
        typeof sessionId !==
          "string"
      ) {

        res.status(400).json({
          message:
            "Invalid Session ID",
        });

        return;
      }

      // =================================
      // GET STRIPE SESSION
      // =================================

      const session =
        await stripe
          .checkout
          .sessions
          .retrieve(
            sessionId
          );

      // =================================
      // VERIFY PAYMENT
      // =================================

      if (
        session.payment_status !==
        "paid"
      ) {

        res.status(400).json({

          success:
            false,

          paymentStatus:
            session.payment_status,

          message:
            "Payment has not been completed",
        });

        return;
      }

      // =================================
      // GET ORDER ID FROM METADATA
      // =================================

      const orderId =
        session
          .metadata
          ?.orderId;

      if (
        !orderId ||
        !mongoose.Types
          .ObjectId
          .isValid(
            orderId
          )
      ) {

        res.status(400).json({
          message:
            "Order ID was not found in Stripe session",
        });

        return;
      }

      // =================================
      // FIND PENDING ORDER
      // =================================

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {

        res.status(404).json({
          message:
            "Order not found",
        });

        return;
      }

      // =================================
      // SECURITY CHECK
      // =================================

      if (
        order.stripeSessionId &&
        order.stripeSessionId !==
          session.id
      ) {

        res.status(400).json({
          message:
            "Stripe session does not match this order",
        });

        return;
      }

      // =================================
      // GET CUSTOMER
      // =================================

      const customer =
        session
          .customer_details;

      const address =
        customer?.address;

      // =================================
      // SHIPPING ADDRESS
      // =================================

      if (address) {

        order.shippingAddress = {

          fullName:
            customer?.name ||
            "Customer",

          phone:
            customer?.phone ||
            "",

          address:
            [
              address.line1,
              address.line2,
            ]
              .filter(
                Boolean
              )
              .join(", ") ||
            "N/A",

          city:
            address.city ||
            "N/A",

          country:
            address.country ||
            "N/A",

          postalCode:
            address.postal_code ||
            "",
        };
      }

      // =================================
      // PAYMENT INTENT
      // =================================

      const paymentIntent =
        typeof session
          .payment_intent ===
        "string"
          ? session
              .payment_intent
          : session
              .payment_intent
              ?.id ||
            "";

      // =================================
      // STRIPE TOTAL
      // =================================

      const stripeTotal =
        (
          session.amount_total ||
          0
        ) /
        100;

      // =================================
      // UPDATE ORDER
      // =================================

      order.paymentStatus =
        "paid";

      order.stripeSessionId =
        session.id;

      order.stripePaymentIntentId =
        paymentIntent;

      order.paidAt =
        order.paidAt ||
        new Date();

      // Use Stripe's confirmed total.
      order.totalPrice =
        stripeTotal;

      order.shippingPrice =
        Math.max(
          0,
          stripeTotal -
            order.itemsPrice
        );

      await order.save();

      // =================================
      // GET STRIPE LINE ITEMS
      // =================================

      const stripeLineItems =
        await stripe
          .checkout
          .sessions
          .listLineItems(
            sessionId,
            {

              limit:
                100,

              expand: [
                "data.price.product",
              ],
            }
          );

      // =================================
      // VOUCHER ITEMS
      // =================================

      const voucherItems =
        stripeLineItems.data.map(
          (item) => {

            let name =
              item.description ||
              "Product";

            let description =
              "";

            let image =
              "";

            // =============================
            // PRODUCT
            // =============================

            const product =
              item.price?.product;

            if (
              product &&
              typeof product !==
                "string" &&
              !product.deleted
            ) {

              name =
                product.name ||
                name;

              description =
                product.description ||
                "";

              image =
                product.images?.[0] ||
                "";
            }

            // =============================
            // PRICE
            // =============================

            const unitAmount =
              item.price
                ?.unit_amount ||
              0;

            // =============================
            // QUANTITY
            // =============================

            const quantity =
              item.quantity ||
              0;

            return {

              name,

              description,

              image,

              quantity,

              unitPrice:
                unitAmount /
                100,

              amount:
                (
                  unitAmount *
                  quantity
                ) /
                100,
            };
          }
        );

      // =================================
      // SUCCESS RESPONSE
      // =================================

      res.status(200).json({

        success:
          true,

        orderId:
          order._id,

        sessionId:
          session.id,

        paymentStatus:
          session.payment_status,

        paymentMethod:
          "Card",

        currency:
          session.currency
            ?.toUpperCase() ||
          "USD",

        customerEmail:
          session
            .customer_details
            ?.email ||
          "",

        customerName:
          session
            .customer_details
            ?.name ||
          "",

        totalAmount:
          (
            session.amount_total ||
            0
          ) /
          100,

        items:
          voucherItems,
      });

    } catch (error) {

      console.error(
        "GET STRIPE SESSION ERROR:",
        error
      );

      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to verify payment",
      });
    }
  };

// =====================================
// GET ALL ORDERS
// ADMIN
// =====================================

export const getAllOrders =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      // =================================
      // FIND ORDERS
      // =================================

      const orders =
        await Order
          .find()
          .populate(
            "userId",
            "name email"
          )
          .sort({
            createdAt:
              -1,
          });

      // =================================
      // RESPONSE
      // =================================

      res.status(200).json(
        orders
      );

    } catch (error) {

      console.error(
        "GET ORDERS ERROR:",
        error
      );

      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to get orders",
      });
    }
  };

// =====================================
// UPDATE ORDER STATUS
// ADMIN
// =====================================

export const updateOrderStatus =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      // =================================
      // ORDER ID
      // =================================

      const orderId =
        req.params.id;

      if (
        !orderId ||
        typeof orderId !==
          "string" ||
        !mongoose.Types
          .ObjectId
          .isValid(
            orderId
          )
      ) {

        res.status(400).json({
          message:
            "Invalid order ID",
        });

        return;
      }

      // =================================
      // ORDER STATUS
      // =================================

      const {
        orderStatus,
      }: {
        orderStatus?:
          OrderStatus;
      } =
        req.body;

      // =================================
      // ALLOWED STATUS
      // =================================

      const allowedStatuses:
        readonly OrderStatus[] = [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ];

      // =================================
      // VALIDATE STATUS
      // =================================

      if (
        !orderStatus ||
        !allowedStatuses.includes(
          orderStatus
        )
      ) {

        res.status(400).json({
          message:
            "Invalid order status",
        });

        return;
      }

      // =================================
      // FIND ORDER
      // =================================

      const order =
        await Order.findById(
          orderId
        );

      if (!order) {

        res.status(404).json({
          message:
            "Order not found",
        });

        return;
      }

      // =================================
      // UPDATE STATUS
      // =================================

      order.orderStatus =
        orderStatus;

      // =================================
      // DELIVERED DATE
      // =================================

      if (
        orderStatus ===
        "delivered"
      ) {

        order.deliveredAt =
          new Date();

      } else {

        // exactOptionalPropertyTypes
        // compatible unset

        order.set(
          "deliveredAt",
          undefined
        );
      }

      // =================================
      // SAVE
      // =================================

      const updatedOrder =
        await order.save();

      // =================================
      // RESPONSE
      // =================================

      res.status(200).json(
        updatedOrder
      );

    } catch (error) {

      console.error(
        "UPDATE ORDER ERROR:",
        error
      );

      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to update order status",
      });
    }
  };