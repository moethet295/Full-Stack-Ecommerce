import { apiSlice } from "./api";

// =====================================
// TYPES
// =====================================

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

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
// ORDER
// =====================================

export interface Order {
  _id: string;

  orderItems: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: "stripe";

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

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
// UPDATE STATUS INPUT
// =====================================

export interface UpdateOrderStatusInput {
  id: string;
  orderStatus: OrderStatus;
}

// =====================================
// ORDER API
// =====================================

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =================================
    // GET ALL ORDERS
    // =================================

    getAllOrders: builder.query<Order[], void>({
      query: () => ({
        url: "/orders/admin/all",
        method: "GET",
      }),

      providesTags: ["Order"],
    }),

    // =================================
    // UPDATE ORDER STATUS
    // =================================

    updateOrderStatus: builder.mutation<
      Order,
      UpdateOrderStatusInput
    >({
      query: ({ id, orderStatus }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",

        body: {
          orderStatus,
        },
      }),

      invalidatesTags: ["Order"],
    }),
  }),

  overrideExisting: false,
});

// =====================================
// EXPORT GENERATED HOOKS
// =====================================

export const {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;