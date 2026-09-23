import {
  useState,
} from "react";

import {
  X,
  ShoppingBag,
} from "lucide-react";

import {
  useSelector,
} from "react-redux";

import type {
  RootState,
} from "@/store";

import CartItem
  from "./CartItem";

// =====================================
// PROPS
// =====================================

interface CartDrawerProps {
  isCardOpen: boolean;
  toggleCard: () => void;
}

// =====================================
// COMPONENT
// =====================================

function CartDrawer({
  isCardOpen,
  toggleCard,
}: CartDrawerProps) {

  // =====================================
  // CHECKOUT STATE
  // =====================================

  const [
    isCheckingOut,
    setIsCheckingOut,
  ] = useState(false);

  const [
    checkoutError,
    setCheckoutError,
  ] = useState("");

  // =====================================
  // GET CART
  // =====================================

  const cartItems =
    useSelector(
      (state: RootState) =>
        state.cart.cartItems
    );

  // =====================================
  // BASE URL
  // =====================================

  const baseUrl =
    import.meta.env.VITE_MODE ===
    "development"
      ? import.meta.env
          .VITE_LOCAL_API_URL
      : import.meta.env
          .VITE_API_URL;

  // =====================================
  // TOTAL QUANTITY
  // =====================================

  const totalQuantity =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );

  // =====================================
  // TOTAL PRICE
  // =====================================

  const totalPrice =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        item.price *
          item.quantity,
      0
    );

  // =====================================
  // CHECKOUT HANDLER
  // =====================================

  const checkoutHandler =
    async () => {

      // =================================
      // PREVENT DOUBLE CLICK
      // =================================

      if (isCheckingOut) {
        return;
      }

      // =================================
      // CHECK CART
      // =================================

      if (
        cartItems.length === 0
      ) {
        return;
      }

      try {

        // =================================
        // CLEAR OLD ERROR
        // =================================

        setCheckoutError("");

        // =================================
        // START LOADING
        // =================================

        setIsCheckingOut(true);

        // =================================
        // CHECK API URL
        // =================================

        if (!baseUrl) {
          throw new Error(
            "API URL is not configured"
          );
        }

        // =================================
        // REQUEST BACKEND
        // =================================

        const response =
          await fetch(
            `${baseUrl}/orders/create-checkout-session`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              credentials:
                "include",

              body:
                JSON.stringify({
                  cartItems,
                }),
            }
          );

        // =================================
        // GET RESPONSE
        // =================================

        const data =
          await response.json();

        console.log(
          "Stripe Checkout Response:",
          data
        );

        // =================================
        // CHECK RESPONSE ERROR
        // =================================

        if (!response.ok) {

          throw new Error(
            data?.message ||
              "Checkout failed"
          );
        }

        // =================================
        // CHECK STRIPE URL
        // =================================

        if (!data?.url) {

          throw new Error(
            "Stripe checkout URL not found"
          );
        }

        // =================================
        // REDIRECT TO STRIPE
        // =================================

        window.location.assign(
          data.url
        );

      } catch (error) {

        console.error(
          "Checkout Error:",
          error
        );

        // =================================
        // SHOW ERROR
        // =================================

        if (
          error instanceof Error
        ) {

          setCheckoutError(
            error.message
          );

        } else {

          setCheckoutError(
            "Checkout failed"
          );
        }

        // =================================
        // STOP LOADING
        // =================================

        setIsCheckingOut(
          false
        );
      }
    };

  // =====================================
  // RETURN
  // =====================================

  return (
    <>

      {/* ================================= */}
      {/* OVERLAY */}
      {/* ================================= */}

      {isCardOpen && (

        <div
          onClick={
            toggleCard
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/40
          "
        />

      )}

      {/* ================================= */}
      {/* CART DRAWER */}
      {/* ================================= */}

      <div
        className={`
          fixed
          right-0
          top-0
          z-50
          flex
          h-full
          w-full
          flex-col
          border-l
          bg-background
          shadow-xl
          transition-transform
          duration-300
          sm:w-105

          ${
            isCardOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            p-5
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Your Order
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              {totalQuantity}{" "}

              {totalQuantity === 1
                ? "item"
                : "items"}
            </p>

          </div>

          {/* ================================= */}
          {/* CLOSE BUTTON */}
          {/* ================================= */}

          <button
            type="button"
            onClick={
              toggleCard
            }
            className="
              cursor-pointer
              rounded-full
              p-2
              transition
              hover:bg-muted
            "
          >

            <X
              className="
                h-5
                w-5
              "
            />

          </button>

        </div>

        {/* ================================= */}
        {/* CART ITEMS */}
        {/* ================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
          "
        >

          {cartItems.length >
          0 ? (

            cartItems.map(
              (item) => (

                <CartItem
                  key={
                    item.key
                  }
                  item={
                    item
                  }
                />

              )
            )

          ) : (

            // =============================
            // EMPTY CART
            // =============================

            <div
              className="
                flex
                h-full
                min-h-100
                flex-col
                items-center
                justify-center
                px-6
                text-center
              "
            >

              <div
                className="
                  mb-4
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-muted
                "
              >

                <ShoppingBag
                  className="
                    h-7
                    w-7
                    text-muted-foreground
                  "
                />

              </div>

              <h3
                className="
                  text-lg
                  font-semibold
                "
              >
                Your cart is empty
              </h3>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Add products to your cart
                to see them here.
              </p>

            </div>

          )}

        </div>

        {/* ================================= */}
        {/* FOOTER */}
        {/* ================================= */}

        {cartItems.length >
          0 && (

          <div
            className="
              border-t
              bg-background
              p-5
            "
          >

            {/* ================================= */}
            {/* TOTAL */}
            {/* ================================= */}

            <div
              className="
                mb-4
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Total
              </span>

              <span
                className="
                  text-xl
                  font-bold
                "
              >
                $
                {totalPrice
                  .toLocaleString()}
              </span>

            </div>

            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {checkoutError && (

              <p
                className="
                  mb-3
                  rounded-lg
                  bg-red-50
                  p-3
                  text-sm
                  text-red-500
                "
              >
                {checkoutError}
              </p>

            )}

            {/* ================================= */}
            {/* CHECKOUT BUTTON */}
            {/* ================================= */}

            <button
              type="button"

              // IMPORTANT:
              // Do NOT write checkoutHandler()
              // here.
              onClick={
                checkoutHandler
              }

              disabled={
                isCheckingOut
              }

              className="
                w-full
                cursor-pointer
                rounded-xl
                bg-black
                p-3
                font-medium
                text-white
                transition
                hover:bg-black/90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {isCheckingOut
                ? "Redirecting to Stripe..."
                : "Checkout"}

            </button>

          </div>

        )}

      </div>

    </>
  );
}

export default CartDrawer;