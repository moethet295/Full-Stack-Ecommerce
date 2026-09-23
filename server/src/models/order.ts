import mongoose, {
  Document,
  Schema,
  Types,
} from "mongoose";

// =====================================
// ORDER ITEM INTERFACE
// =====================================

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

// =====================================
// SHIPPING ADDRESS INTERFACE
// =====================================

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

// =====================================
// ORDER INTERFACE
// =====================================

export interface IOrder extends Document {
  userId?: Types.ObjectId;

  orderItems: IOrderItem[];

  // Checkout မတိုင်ခင် Stripe address
  // မရသေးလို့ optional
  shippingAddress?: IShippingAddress;

  paymentMethod: "stripe";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  orderStatus:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;

  stripeSessionId?: string;
  stripePaymentIntentId?: string;

  paidAt?: Date;
  deliveredAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// =====================================
// ORDER ITEM SCHEMA
// =====================================

const orderItemSchema =
  new Schema<IOrderItem>(
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      image: {
        type: String,
        default: "",
      },

      size: {
        type: String,
        required: true,
      },

      color: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    {
      _id: false,
    }
  );

// =====================================
// SHIPPING ADDRESS SCHEMA
// =====================================

const shippingAddressSchema =
  new Schema<IShippingAddress>(
    {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        default: "",
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

// =====================================
// ORDER SCHEMA
// =====================================

const orderSchema =
  new Schema<IOrder>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },

      orderItems: {
        type: [orderItemSchema],
        required: true,
      },

      // =================================
      // PAYMENT မလုပ်ခင် address မရှိသေးနိုင်
      // =================================

      shippingAddress: {
        type: shippingAddressSchema,
        required: false,
      },

      paymentMethod: {
        type: String,
        enum: ["stripe"],
        default: "stripe",
      },

      paymentStatus: {
        type: String,
        enum: [
          "pending",
          "paid",
          "failed",
          "refunded",
        ],
        default: "pending",
      },

      orderStatus: {
        type: String,
        enum: [
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ],
        default: "pending",
      },

      itemsPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      shippingPrice: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      stripeSessionId: {
        type: String,
        default: "",
      },

      stripePaymentIntentId: {
        type: String,
        default: "",
      },

      paidAt: {
        type: Date,
      },

      deliveredAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

// =====================================
// INDEXES
// =====================================

orderSchema.index({
  userId: 1,
  createdAt: -1,
});

orderSchema.index({
  stripeSessionId: 1,
});

orderSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

// =====================================
// MODEL
// =====================================

export const Order =
  mongoose.model<IOrder>(
    "Order",
    orderSchema
  );