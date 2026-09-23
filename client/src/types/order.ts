// =====================================
// ORDER ITEM
// =====================================

export interface OrderItem {
  productId: string;

  name: string;

  price: number;

  image: string;

  size: string;

  color: string;

  quantity: number;
}

// =====================================
// SHIPPING ADDRESS
// =====================================

export interface ShippingAddress {
  fullName: string;

  phone: string;

  address: string;

  city: string;

  country: string;

  postalCode?: string;
}

// =====================================
// PAYMENT STATUS
// =====================================

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

// =====================================
// ORDER STATUS
// =====================================

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// =====================================
// PAYMENT METHOD
// =====================================

export type PaymentMethod =
  "stripe";

// =====================================
// ORDER
// =====================================

export interface Order {
  _id: string;

  userId: string;

  orderItems:
    OrderItem[];

  shippingAddress:
    ShippingAddress;

  paymentMethod:
    PaymentMethod;

  paymentStatus:
    PaymentStatus;

  orderStatus:
    OrderStatus;

  itemsPrice: number;

  shippingPrice: number;

  totalPrice: number;

  stripeSessionId?: string;

  stripePaymentIntentId?: string;

  paidAt?: string;

  deliveredAt?: string;

  createdAt: string;

  updatedAt: string;
}

// =====================================
// CREATE CHECKOUT REQUEST
// =====================================

export interface CreateCheckoutRequest {
  cartItems:
    OrderItem[];

  shippingAddress?:
    ShippingAddress;
}

// =====================================
// CREATE CHECKOUT RESPONSE
// =====================================

export interface CreateCheckoutResponse {
  success: boolean;

  sessionId: string;

  url: string;
}

// =====================================
// CREATE ORDER REQUEST
// =====================================

export interface CreateOrderRequest {
  orderItems:
    OrderItem[];

  shippingAddress:
    ShippingAddress;

  paymentMethod:
    PaymentMethod;
}

// =====================================
// UPDATE ORDER STATUS REQUEST
// =====================================

export interface UpdateOrderStatusRequest {
  orderStatus:
    OrderStatus;
}