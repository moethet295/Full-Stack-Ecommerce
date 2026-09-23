import {
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

import {
  useDispatch,
} from "react-redux";

import type {
  AppDispatch,
} from "@/store";

import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  type CartItem as CartItemType,
} from "@/store/slices/cart";

// =====================================
// PROPS
// =====================================

interface CartItemProps {
  item: CartItemType;
}

// =====================================
// COMPONENT
// =====================================

function CartItem({
  item,
}: CartItemProps) {

  const dispatch =
    useDispatch<AppDispatch>();

  // =====================================
  // INCREASE
  // =====================================

  const increaseHandler =
    () => {
      dispatch(
        increaseQuantity(
          item.key
        )
      );
    };

  // =====================================
  // DECREASE
  // =====================================

  const decreaseHandler =
    () => {
      dispatch(
        decreaseQuantity(
          item.key
        )
      );
    };

  // =====================================
  // DELETE
  // =====================================

  const removeHandler =
    () => {
      dispatch(
        removeFromCart(
          item.key
        )
      );
    };

  // =====================================
  // RETURN
  // =====================================

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-3
        border-b
        border-gray-200
        p-4
      "
    >

      {/* ================================= */}
      {/* PRODUCT */}
      {/* ================================= */}

      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-3
        "
      >

        {/* ================================= */}
        {/* SMALL PRODUCT IMAGE */}
        {/* ================================= */}

        <img
          src={item.image}
          alt={item.name}
          className="
            h-12
            w-12
            shrink-0
            rounded-lg
            border
            border-gray-200
            object-cover
          "
        />

        {/* ================================= */}
        {/* PRODUCT INFORMATION */}
        {/* ================================= */}

        <div
          className="
            min-w-0
            flex-1
          "
        >

          {/* PRODUCT NAME */}

          <p
            className="
              truncate
              text-sm
              font-semibold
            "
          >
            {item.name}
          </p>

          {/* SIZE + COLOR */}

          <p
            className="
              mt-0.5
              text-xs
              capitalize
              text-gray-500
            "
          >
            Size: {item.size}
            {" · "}
            Color: {item.color}
          </p>

          {/* PRICE */}

          <p
            className="
              mt-1
              text-sm
              font-semibold
            "
          >
            $
            {(
              item.price *
              item.quantity
            ).toLocaleString()}
          </p>

        </div>

      </div>

      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div
        className="
          flex
          shrink-0
          flex-col
          items-end
          gap-3
        "
      >

        {/* ================================= */}
        {/* DELETE */}
        {/* ================================= */}

        <button
          type="button"
          onClick={
            removeHandler
          }
          className="
            cursor-pointer
            rounded-md
            p-1
            text-red-500
            transition
            hover:bg-red-50
          "
        >

          <Trash2
            className="
              h-4
              w-4
            "
          />

        </button>

        {/* ================================= */}
        {/* QUANTITY */}
        {/* ================================= */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          {/* MINUS */}

          <button
            type="button"
            onClick={
              decreaseHandler
            }
            disabled={
              item.quantity <= 1
            }
            className="
              flex
              h-7
              w-7
              cursor-pointer
              items-center
              justify-center
              rounded-md
              bg-black
              text-white
              transition
              hover:bg-black/80
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >

            <Minus
              className="
                h-3
                w-3
              "
            />

          </button>

          {/* QUANTITY NUMBER */}

          <span
            className="
              min-w-5
              text-center
              text-sm
              font-semibold
            "
          >
            {item.quantity}
          </span>

          {/* PLUS */}

          <button
            type="button"
            onClick={
              increaseHandler
            }
            className="
              flex
              h-7
              w-7
              cursor-pointer
              items-center
              justify-center
              rounded-md
              bg-black
              text-white
              transition
              hover:bg-black/80
            "
          >

            <Plus
              className="
                h-3
                w-3
              "
            />

          </button>

        </div>

      </div>

    </div>
  );
}

export default CartItem;