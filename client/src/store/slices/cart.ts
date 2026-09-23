import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

// =====================================
// CART ITEM TYPE
// =====================================

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

// =====================================
// CART STATE TYPE
// =====================================

interface CartState {
  cartItems: CartItem[];
}

// =====================================
// INITIAL STATE
// =====================================

const initialState: CartState = {
  cartItems: [],
};

// =====================================
// CART SLICE
// =====================================

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // =================================
    // ADD TO CART
    // =================================

    addToCart: (
      state,
      action: PayloadAction<CartItem>
    ) => {
      const newItem =
        action.payload;

      const existingItem =
        state.cartItems.find(
          (item) =>
            item.productId ===
              newItem.productId &&
            item.size ===
              newItem.size &&
            item.color ===
              newItem.color
        );

      if (existingItem) {
        existingItem.quantity +=
          newItem.quantity;
      } else {
        state.cartItems.push(
          newItem
        );
      }
    },

    // =================================
    // INCREASE QUANTITY
    // =================================

    increaseQuantity: (
      state,
      action: PayloadAction<string>
    ) => {
      const item =
        state.cartItems.find(
          (item) =>
            item.key ===
            action.payload
        );

      if (item) {
        item.quantity += 1;
      }
    },

    // =================================
    // DECREASE QUANTITY
    // =================================

    decreaseQuantity: (
      state,
      action: PayloadAction<string>
    ) => {
      const item =
        state.cartItems.find(
          (item) =>
            item.key ===
            action.payload
        );

      if (
        item &&
        item.quantity > 1
      ) {
        item.quantity -= 1;
      }
    },

    // =================================
    // REMOVE FROM CART
    // =================================

    removeFromCart: (
      state,
      action: PayloadAction<string>
    ) => {
      state.cartItems =
        state.cartItems.filter(
          (item) =>
            item.key !==
            action.payload
        );
    },

    // =================================
    // CLEAR CART
    // =================================

    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

// =====================================
// ACTIONS
// =====================================

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

// =====================================
// REDUCER
// =====================================

export default cartSlice.reducer;