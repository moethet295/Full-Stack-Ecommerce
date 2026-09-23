import express
  from "express";

import {
  createCheckoutSession,
  getCheckoutSession,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order";

// =====================================
// ROUTER
// =====================================

const router =
  express.Router();

// =====================================
// CREATE CHECKOUT
// =====================================

router.post(
  "/orders/create-checkout-session",
  createCheckoutSession
);

// =====================================
// VERIFY PAYMENT / VOUCHER
// =====================================

router.get(
  "/orders/checkout-session/:sessionId",
  getCheckoutSession
);

// =====================================
// ADMIN - GET ALL ORDERS
// =====================================

router.get(
  "/orders/admin/all",
  getAllOrders
);

// =====================================
// ADMIN - UPDATE ORDER STATUS
// =====================================

router.put(
  "/orders/:id/status",
  updateOrderStatus
);

// =====================================
// EXPORT
// =====================================

export default router;