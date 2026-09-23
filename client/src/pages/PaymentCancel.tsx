import {
  Link,
} from "react-router-dom";

import {
  XCircle,
} from "lucide-react";

function PaymentCancel() {

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

        <XCircle
          className="
            mx-auto
            mb-5
            h-16
            w-16
            text-red-500
          "
        />

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Payment Cancelled
        </h1>

        <p
          className="
            mt-3
            text-muted-foreground
          "
        >
          Your payment was cancelled.
          Your cart is still available.
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
            text-white
          "
        >
          Back to Shop
        </Link>

      </div>

    </div>
  );
}

export default PaymentCancel;