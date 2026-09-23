import {
  StrictMode,
} from "react";

import {
  createRoot,
} from "react-dom/client";

import "./index.css";

// =====================================
// LAYOUT
// =====================================

import Main
  from "./layout/Main.tsx";

// =====================================
// PAGES
// =====================================

import Home
  from "./pages/Home.tsx";

import {
  Login,
} from "./pages/Login.tsx";

import Register
  from "./pages/Register.tsx";

import ProductDetails
  from "./component/product/ProductDetails.tsx";

import IsLogin
  from "./pages/protector/IsLogin.tsx";

import IsAdmin
  from "./pages/protector/IsAdmin.tsx";

import Profile
  from "./pages/Profile.tsx";

import ResetPassword
  from "./pages/ResetPassword.tsx";

import ForgotPassword
  from "./pages/ForgotPassword.tsx";

import ProductFilter
  from "./pages/ProductFilter.tsx";

// =====================================
// PAYMENT
// =====================================

import PaymentSuccess
  from "./pages/PaymentSuccess.tsx";

import PaymentCancel
  from "./pages/PaymentCancel.tsx";

// =====================================
// ADMIN
// =====================================

import Panel
  from "./pages/admin/Panel.tsx";

import DashBorad
  from "./pages/admin/DashBorad.tsx";

import ProductCreate
  from "./pages/admin/ProductCreate.tsx";

import ProductUpdate
  from "./pages/admin/ProductUpdate.tsx";

import ProductUpdateList
  from "./pages/admin/ProductUpdateList.tsx";

import ProductDelete
  from "./pages/admin/ProductDelete.tsx";

import ProductManagement
  from "./pages/admin/ProductManagement.tsx";

import UserManagement
  from "./pages/admin/UserManagement.tsx";

import OrderManagement
  from "./pages/admin/OrderManagement.tsx";

// =====================================
// ROUTER
// =====================================

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// =====================================
// REDUX
// =====================================

import {
  Provider,
} from "react-redux";

import {
  store,
  persistor,
} from "./store/index.ts";

// =====================================
// PERSIST
// =====================================

import {
  PersistGate,
} from "redux-persist/integration/react";

// =====================================
// TOAST
// =====================================

import {
  Toaster,
} from "@/components/ui/toast";


// =====================================
// ROUTER
// =====================================

const router =
  createBrowserRouter([

    {
      path:
        "/",

      element:
        <Main />,

      children: [

        {
          index: true,
          element: <Home />,
        },

        {
          path: "login",
          element: <Login />,
        },

        {
          path: "register",
          element: <Register />,
        },

        {
          path: "reset-password/:id",
          element: <ResetPassword />,
        },

        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },

        {
          path: "products/filter",
          element: <ProductFilter />,
        },

        {
          path: "products/:id",
          element: <ProductDetails />,
        },

        {
          path: "payment-cancel",
          element: <PaymentCancel />,
        },


        // =====================================
        // PROFILE
        // =====================================

        {
          path: "profile",

          element: (

            <IsLogin>

              <Profile />

            </IsLogin>

          ),

        },


        // =====================================
        // ADMIN
        // =====================================

        {
          path: "admin",

          element: (

            <IsAdmin>

              <Panel />

            </IsAdmin>

          ),

          children: [

            {
              index: true,
              element: <DashBorad />,
            },


            // =================================
            // PRODUCT MANAGEMENT
            // =================================

            {
              path:
                "manage-products",

              element:
                <ProductManagement />,
            },


            // =================================
            // USER MANAGEMENT
            // =================================

            {
              path:
                "manage-users",

              element:
                <UserManagement />,
            },


            // =================================
            // ORDER MANAGEMENT
            // =================================

            {
              path:
                "manage-orders",

              element:
                <OrderManagement />,
            },


            // =================================
            // CREATE PRODUCT
            // =================================

            {
              path:
                "create-product",

              element:
                <ProductCreate />,
            },


            // =================================
            // SELECT PRODUCT TO UPDATE
            // =================================

            {
              path:
                "update-product",

              element:
                <ProductUpdateList />,
            },


            // =================================
            // EDIT SELECTED PRODUCT
            // =================================

            {
              path:
                "edit-product/:id",

              element:
                <ProductUpdate />,
            },


            // =================================
            // DELETE PRODUCT
            // =================================

            {
              path:
                "delete-product",

              element:
                <ProductDelete />,
            },

          ],

        },

      ],

    },


    // =====================================
    // PAYMENT SUCCESS
    // =====================================

    {
      path:
        "/payment-success",

      element:
        <PaymentSuccess />,
    },

  ]);


// =====================================
// ROOT
// =====================================

const rootElement =
  document.getElementById(
    "root"
  );


if (!rootElement) {

  throw new Error(
    "Root element not found"
  );

}


// =====================================
// RENDER
// =====================================

createRoot(
  rootElement
).render(

  <StrictMode>

    <Provider store={store}>

      <PersistGate
        loading={

          <div
            className="
              flex
              min-h-screen
              items-center
              justify-center
            "
          >
            Loading...
          </div>

        }
        persistor={persistor}
      >

        <Toaster />

        <RouterProvider
          router={router}
        />

      </PersistGate>

    </Provider>

  </StrictMode>

);