import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  useDispatch,
} from "react-redux";

import RatingCoverter
  from "../../common/RatingCoverter";

import {
  Plus,
  Minus,
} from "lucide-react";

import {
  useGetProductDetailQuery,
} from "@/store/slices/productApiSlice";

import type {
  ProductImage,
} from "@/types/product";

import type {
  AppDispatch,
} from "@/store";

import {
  addToCart,
} from "@/store/slices/cart";

// =====================================
// COMPONENT
// =====================================

function ProductDetails() {

  const dispatch =
    useDispatch<AppDispatch>();

  // =====================================
  // SELECTED IMAGE
  // =====================================

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<string>();

  // =====================================
  // SELECTED COLOR
  // =====================================

  const [
    selectedColor,
    setSelectedColor,
  ] = useState<string>();

  // =====================================
  // SELECTED SIZE
  // =====================================

  const [
    selectedSize,
    setSelectedSize,
  ] = useState<string>();

  // =====================================
  // QUANTITY
  // =====================================

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  // =====================================
  // PRODUCT ID
  // =====================================

  const { id } =
    useParams<{
      id: string;
    }>();

  // =====================================
  // GET PRODUCT
  // =====================================

  const {
    data: product,
    isLoading,
    isFetching,
    isError,
  } = useGetProductDetailQuery(
    id ?? "",
    {
      skip: !id,

      refetchOnMountOrArgChange:
        true,
    }
  );

  // =====================================
  // PRODUCT CHANGED
  // =====================================

  useEffect(() => {

    if (!product) {
      return;
    }

    // IMAGE

    if (
      product.images &&
      product.images.length > 0
    ) {
      setSelectedImage(
        product.images[0].url
      );
    } else {
      setSelectedImage(
        undefined
      );
    }

    // COLOR

    if (
      product.colors &&
      product.colors.length > 0
    ) {
      setSelectedColor(
        product.colors[0]
      );
    } else {
      setSelectedColor(
        undefined
      );
    }

    // SIZE

    if (
      product.sizes &&
      product.sizes.length > 0
    ) {
      setSelectedSize(
        product.sizes[0]
      );
    } else {
      setSelectedSize(
        undefined
      );
    }

    // QUANTITY

    setQuantity(1);

  }, [product]);

  // =====================================
  // INCREASE QUANTITY
  // =====================================

  const increaseQuantityHandler =
    () => {

      if (!product) {
        return;
      }

      if (
        quantity <
        product.instock_count
      ) {
        setQuantity(
          (previous) =>
            previous + 1
        );
      }
    };

  // =====================================
  // DECREASE QUANTITY
  // =====================================

  const decreaseQuantityHandler =
    () => {

      setQuantity(
        (previous) =>
          previous > 1
            ? previous - 1
            : 1
      );
    };

  // =====================================
  // ADD TO CART
  // =====================================

  const addToCartHandler =
    () => {

      if (!product) {
        return;
      }

      if (!selectedColor) {
        return;
      }

      if (!selectedSize) {
        return;
      }

      if (
        product.instock_count <= 0
      ) {
        return;
      }

      // Product + size + color
      // ကို unique ဖြစ်အောင် key ဆောက်တယ်

      const cartKey =
        `${product._id}-${selectedSize}-${selectedColor}`;

      dispatch(
        addToCart({
          key: cartKey,

          productId:
            product._id,

          name:
            product.name,

          price:
            product.price,

          image:
            selectedImage ||
            product.images[0]?.url ||
            "",

          size:
            selectedSize,

          color:
            selectedColor,

          quantity:
            quantity,
        })
      );

      // Add ပြီးရင် quantity ကို
      // 1 ပြန်ထားမယ်

      setQuantity(1);
    };

  // =====================================
  // LOADING
  // =====================================

  if (
    isLoading ||
    isFetching
  ) {
    return (
      <p
        className="
          mt-10
          text-center
        "
      >
        Loading...
      </p>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (
    isError ||
    !product
  ) {
    return (
      <p
        className="
          mt-10
          text-center
          text-red-500
        "
      >
        Product not found
      </p>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <section
      className="
        mt-15
        grid
        grid-cols-1
        gap-10
        lg:grid-cols-2
      "
    >

      {/* ================================= */}
      {/* LEFT SIDE */}
      {/* ================================= */}

      <div
        className="
          grid
          h-96
          grid-cols-4
          gap-8
        "
      >

        {/* SMALL IMAGES */}

        <div
          className="
            col-span-1
            flex
            flex-col
            gap-8
          "
        >

          {product.images.map(
            (
              image: ProductImage,
              index: number
            ) => (

              <div
                key={
                  image.url ||
                  index
                }
                className={`
                  ${
                    selectedImage ===
                    image.url
                      ? "w-fit rounded-xl border-2 border-gray-400"
                      : ""
                  }
                `}
              >

                <img
                  src={
                    image.url
                  }
                  alt={
                    image.public_alt ||
                    product.name
                  }
                  className="
                    h-25
                    w-25
                    cursor-pointer
                    rounded-xl
                    object-cover
                  "
                  onClick={() =>
                    setSelectedImage(
                      image.url
                    )
                  }
                />

              </div>

            )
          )}

        </div>

        {/* MAIN IMAGE */}

        <img
          src={
            selectedImage ||
            product.images[0]?.url
          }
          alt={
            product.name
          }
          className="
            col-span-3
            h-120
            w-full
            max-w-md
            rounded-xl
            object-cover
          "
        />

      </div>

      {/* ================================= */}
      {/* RIGHT SIDE */}
      {/* ================================= */}

      <div>

        {/* PRODUCT NAME */}

        <h2
          className="
            text-2xl
            font-medium
          "
        >
          {product.name}
        </h2>

        {/* RATING */}

        <RatingCoverter
          count={
            product.rating_count
          }
        />

        {/* PRICE */}

        <div
          className="
            mb-3
            text-2xl
            font-bold
          "
        >
          $
          {product.price}
        </div>

        {/* DESCRIPTION */}

        <div
          className="
            prose
            mb-3
            max-w-none
          "
          dangerouslySetInnerHTML={{
            __html:
              product.description ||
              "",
          }}
        />

        <hr
          className="
            mb-5
            mt-5
            border
          "
        />

        {/* ================================= */}
        {/* COLORS */}
        {/* ================================= */}

        <h2
          className="
            mt-3
            text-2xl
            font-bold
          "
        >
          Colors
        </h2>

        {product.colors.length >
        0 ? (

          <div
            className="
              mt-3
              flex
              items-center
              gap-3
            "
          >

            {product.colors.map(
              (
                color: string,
                index: number
              ) => (

                <button
                  type="button"
                  key={
                    `${color}-${index}`
                  }
                  title={
                    color
                  }
                  onClick={() =>
                    setSelectedColor(
                      color
                    )
                  }
                  className={`
                    h-8
                    w-8
                    cursor-pointer
                    rounded-full
                    transition
                    ${
                      selectedColor ===
                      color
                        ? "scale-90 ring-2 ring-gray-500 ring-offset-2"
                        : "border border-gray-300"
                    }
                  `}
                  style={{
                    backgroundColor:
                      color,
                  }}
                />

              )
            )}

          </div>

        ) : (

          <p
            className="
              mt-3
              text-gray-500
            "
          >
            No colors available
          </p>

        )}

        <hr
          className="
            mb-5
            mt-5
            border
          "
        />

        {/* ================================= */}
        {/* SIZES */}
        {/* ================================= */}

        <h2
          className="
            text-2xl
            font-bold
          "
        >
          Sizes
        </h2>

        {product.sizes.length >
        0 ? (

          <div
            className="
              mt-3
              flex
              items-center
              gap-4
            "
          >

            {product.sizes.map(
              (
                size: string,
                index: number
              ) => (

                <button
                  type="button"
                  key={
                    `${size}-${index}`
                  }
                  onClick={() =>
                    setSelectedSize(
                      size
                    )
                  }
                  className={`
                    cursor-pointer
                    rounded-full
                    border
                    border-gray-400
                    px-4
                    py-2
                    text-sm
                    transition
                    ${
                      selectedSize ===
                      size
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }
                  `}
                >
                  {size}
                </button>

              )
            )}

          </div>

        ) : (

          <p
            className="
              mt-3
              text-gray-500
            "
          >
            No sizes available
          </p>

        )}

        <hr
          className="
            mb-5
            mt-5
            border
          "
        />

        {/* STOCK */}

        <p
          className="
            text-sm
            text-muted-foreground
          "
        >
          {product.instock_count >
          0
            ? `${product.instock_count} items available`
            : "Out of stock"}
        </p>

        {/* ================================= */}
        {/* QUANTITY + CART */}
        {/* ================================= */}

        <div
          className="
            mt-6
            flex
            items-center
            gap-4
          "
        >

          {/* MINUS */}

          <button
            type="button"
            onClick={
              decreaseQuantityHandler
            }
            disabled={
              quantity <= 1
            }
            className="
              cursor-pointer
              rounded-full
              bg-black
              p-3
              text-white
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

          {/* QUANTITY */}

          <div
            className="
              min-w-8
              text-center
              text-2xl
              font-semibold
            "
          >
            {quantity}
          </div>

          {/* PLUS */}

          <button
            type="button"
            onClick={
              increaseQuantityHandler
            }
            disabled={
              quantity >=
                product.instock_count ||
              product.instock_count <= 0
            }
            className="
              cursor-pointer
              rounded-full
              bg-black
              p-3
              text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <Plus
              className="
                h-3
                w-3
              "
            />
          </button>

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={
              addToCartHandler
            }
            disabled={
              product.instock_count <=
                0 ||
              !selectedColor ||
              !selectedSize
            }
            className="
              w-full
              cursor-pointer
              rounded-full
              border
              bg-black
              px-4
              py-2
              text-xl
              font-medium
              text-white
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {product.instock_count >
            0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

        </div>

      </div>

    </section>
  );
}

export default ProductDetails;