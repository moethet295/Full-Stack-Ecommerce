import {
  configureStore,
} from "@reduxjs/toolkit";

import authReducer
  from "./slices/auth";

import cartReducer
  from "./slices/cart";

import {
  apiSlice,
} from "./slices/api";

// =====================================
// REDUX PERSIST
// =====================================

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// =====================================
// CUSTOM STORAGE
// =====================================

import storage
  from "./storage";

// =====================================
// CART PERSIST CONFIG
// =====================================

const cartPersistConfig = {
  key: "cart",

  version: 1,

  storage,
};

// =====================================
// PERSISTED CART
// =====================================

const persistedCartReducer =
  persistReducer(
    cartPersistConfig,
    cartReducer
  );

// =====================================
// STORE
// =====================================

export const store =
  configureStore({
    reducer: {
      // AUTH
      auth:
        authReducer,

      // CART
      cart:
        persistedCartReducer,

      // API
      [apiSlice.reducerPath]:
        apiSlice.reducer,
    },

    middleware:
      (
        getDefaultMiddleware
      ) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [
              FLUSH,
              REHYDRATE,
              PAUSE,
              PERSIST,
              PURGE,
              REGISTER,
            ],
          },
        }).concat(
          apiSlice.middleware
        ),

    devTools: true,
  });

// =====================================
// PERSISTOR
// =====================================

export const persistor =
  persistStore(store);

// =====================================
// TYPES
// =====================================

export type RootState =
  ReturnType<
    typeof store.getState
  >;

export type AppDispatch =
  typeof store.dispatch;