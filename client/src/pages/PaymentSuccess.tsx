import {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  CheckCircle2,
  Loader2,
} from "lucide-react";

import type {
  AppDispatch,
} from "@/store";

import {
  clearCart,
} from "@/store/slices/cart";

// =====================================
// VOUCHER ITEM
// =====================================

interface VoucherItem {
  name: string;

  description: string;

  image: string;

  quantity: number;

  unitPrice: number;

  amount: number;
}

// =====================================
// VOUCHER TYPE
// =====================================

interface VoucherData {
  success: boolean;

  sessionId: string;

  paymentStatus: string;

  paymentMethod: string;

  currency: string;

  customerEmail: string;

  customerName: string;

  totalAmount: number;

  items: VoucherItem[];
}

// =====================================
// COMPONENT
// =====================================

function PaymentSuccess() {

  const dispatch =
    useDispatch<AppDispatch>();

  const [
    searchParams,
  ] =
    useSearchParams();

  const [
    voucher,
    setVoucher,
  ] =
    useState<VoucherData | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  // =====================================
  // SESSION ID
  // =====================================

  const sessionId =
    searchParams.get(
      "session_id"
    );

  // =====================================
  // API BASE URL
  // =====================================

  const baseUrl =
    import.meta.env.VITE_MODE ===
    "development"
      ? import.meta.env
          .VITE_LOCAL_API_URL
      : import.meta.env
          .VITE_API_URL;

  // =====================================
  // GET VOUCHER
  // =====================================

  useEffect(
    () => {

      if (!sessionId) {

        setError(
          "Payment session was not found."
        );

        setIsLoading(
          false
        );

        return;
      }

      const getVoucher =
        async () => {

          try {

            setIsLoading(
              true
            );

            setError(
              ""
            );

            // =================================
            // VERIFY PAYMENT
            // =================================

            const response =
              await fetch(
                `${baseUrl}/orders/checkout-session/${sessionId}`,
                {
                  method:
                    "GET",

                  credentials:
                    "include",
                }
              );

            const data =
              await response.json();

            // =================================
            // ERROR
            // =================================

            if (
              !response.ok
            ) {

              throw new Error(
                data?.message ||
                  "Unable to verify payment"
              );
            }

            // =================================
            // CHECK PAID
            // =================================

            if (
              data.paymentStatus !==
              "paid"
            ) {

              throw new Error(
                "Payment has not been completed"
              );
            }

            // =================================
            // SET VOUCHER
            // =================================

            setVoucher(
              data
            );

            // =================================
            // CLEAR CART ONLY AFTER
            // PAYMENT IS VERIFIED
            // =================================

            dispatch(
              clearCart()
            );

          } catch (error) {

            console.error(
              "Voucher Error:",
              error
            );

            if (
              error instanceof Error
            ) {

              setError(
                error.message
              );

            } else {

              setError(
                "Unable to load voucher"
              );
            }

          } finally {

            setIsLoading(
              false
            );
          }
        };

      getVoucher();

    },
    [
      sessionId,
      baseUrl,
      dispatch,
    ]
  );

  // =====================================
  // LOADING
  // =====================================

  if (isLoading) {

    return (
      <div
        className="
          flex
          min-h-125
          items-center
          justify-center
        "
      >

        <div
          className="
            text-center
          "
        >

          <Loader2
            className="
              mx-auto
              h-8
              w-8
              animate-spin
            "
          />

          <p
            className="
              mt-3
              text-sm
              text-muted-foreground
            "
          >
            Verifying payment...
          </p>

        </div>

      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (
    error ||
    !voucher
  ) {

    return (
      <div
        className="
          flex
          min-h-125
          items-center
          justify-center
        "
      >

        <div
          className="
            max-w-md
            text-center
          "
        >

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Unable to load voucher
          </h1>

          <p
            className="
              mt-3
              text-sm
              text-red-500
            "
          >
            {error}
          </p>

          <Link
            to="/"
            className="
              mt-6
              inline-flex
              rounded-lg
              bg-black
              px-6
              py-3
              text-sm
              font-medium
              text-white
            "
          >
            Back to Home
          </Link>

        </div>

      </div>
    );
  }

  // =====================================
  // SUCCESS
  // =====================================

  return (
    <section
      className="
        mx-auto
        max-w-2xl
        py-10
      "
    >

      {/* ================================= */}
      {/* SUCCESS HEADER */}
      {/* ================================= */}

      <div
        className="
          mb-8
          text-center
        "
      >

        <CheckCircle2
          className="
            mx-auto
            mb-4
            h-14
            w-14
            text-green-500
          "
        />

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Payment Successful
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          Thank you for your order.
        </p>

      </div>

      {/* ================================= */}
      {/* VOUCHER */}
      {/* ================================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          bg-white
          shadow-sm
        "
      >

        {/* ================================= */}
        {/* VOUCHER HEADER */}
        {/* ================================= */}

        <div
          className="
            border-b
            p-6
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Order Voucher
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted-foreground
                "
              >
                Payment Receipt
              </p>

            </div>

            <div
              className="
                rounded-full
                bg-green-50
                px-3
                py-1
                text-xs
                font-semibold
                uppercase
                text-green-600
              "
            >
              {voucher.paymentStatus}
            </div>

          </div>

          {/* SESSION ID */}

          <div
            className="
              mt-5
              space-y-2
              text-sm
            "
          >

            <div
              className="
                flex
                justify-between
                gap-4
              "
            >

              <span
                className="
                  text-muted-foreground
                "
              >
                Payment
              </span>

              <span
                className="
                  font-medium
                "
              >
                {voucher.paymentMethod}
              </span>

            </div>

            {voucher.customerName && (

              <div
                className="
                  flex
                  justify-between
                  gap-4
                "
              >

                <span
                  className="
                    text-muted-foreground
                  "
                >
                  Customer
                </span>

                <span
                  className="
                    text-right
                    font-medium
                  "
                >
                  {voucher.customerName}
                </span>

              </div>

            )}

            {voucher.customerEmail && (

              <div
                className="
                  flex
                  justify-between
                  gap-4
                "
              >

                <span
                  className="
                    text-muted-foreground
                  "
                >
                  Email
                </span>

                <span
                  className="
                    text-right
                    text-xs
                    font-medium
                  "
                >
                  {voucher.customerEmail}
                </span>

              </div>

            )}

          </div>

        </div>

        {/* ================================= */}
        {/* ITEMS */}
        {/* ================================= */}

        <div
          className="
            divide-y
          "
        >

          {voucher.items.map(
            (
              item,
              index
            ) => (

              <div
                key={
                  `${item.name}-${index}`
                }
                className="
                  flex
                  items-center
                  gap-3
                  p-5
                "
              >

                {/* PRODUCT IMAGE */}

                {item.image ? (

                  <img
                    src={
                      item.image
                    }
                    alt={
                      item.name
                    }
                    className="
                      h-12
                      w-12
                      shrink-0
                      rounded-lg
                      border
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      h-12
                      w-12
                      shrink-0
                      rounded-lg
                      bg-muted
                    "
                  />

                )}

                {/* PRODUCT DETAILS */}

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >

                  <p
                    className="
                      truncate
                      text-sm
                      font-semibold
                    "
                  >
                    {item.name}
                  </p>

                  {item.description && (

                    <p
                      className="
                        mt-0.5
                        text-xs
                        text-muted-foreground
                      "
                    >
                      {item.description}
                    </p>

                  )}

                  <p
                    className="
                      mt-1
                      text-xs
                      text-muted-foreground
                    "
                  >
                    {voucher.currency}{" "}
                    {item.unitPrice.toLocaleString()}
                    {" × "}
                    {item.quantity}
                  </p>

                </div>

                {/* ITEM TOTAL */}

                <div
                  className="
                    shrink-0
                    text-sm
                    font-semibold
                  "
                >
                  $
                  {item.amount
                    .toLocaleString()}
                </div>

              </div>

            )
          )}

        </div>

        {/* ================================= */}
        {/* TOTAL */}
        {/* ================================= */}

        <div
          className="
            border-t
            bg-gray-50
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <span
              className="
                font-semibold
              "
            >
              Total Amount
            </span>

            <span
              className="
                text-2xl
                font-bold
              "
            >
              $
              {voucher.totalAmount
                .toLocaleString()}
            </span>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* CONTINUE SHOPPING */}
      {/* ================================= */}

      <div
        className="
          mt-6
          text-center
        "
      >

        <Link
          to="/"
          className="
            inline-flex
            rounded-lg
            bg-black
            px-6
            py-3
            text-sm
            font-medium
            text-white
            transition
            hover:bg-black/90
          "
        >
          Continue Shopping
        </Link>

      </div>

    </section>
  );
}

export default PaymentSuccess;