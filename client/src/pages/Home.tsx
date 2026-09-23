import { useState } from "react";

import {
  useGetFeaturedQuery,
  useGetNewArrivalsQuery,
  useGetProductsMetaQuery,
} from "@/store/slices/productApiSlice";

import ProductList from "../component/product/ProductList";

function Home() {

  // =========================================
  // GET PRODUCTS
  // =========================================

  const {
    data: newArrivals = [],
    isLoading: newArrivalLoading,
  } = useGetNewArrivalsQuery(undefined);

  const {
    data: featured = [],
    isLoading: featuredLoading,
  } = useGetFeaturedQuery(undefined);

  // =========================================
  // GET PRODUCT META
  // =========================================

  const {
    data: productMeta,
  } = useGetProductsMetaQuery();

  // =========================================
  // FILTER STATES
  // =========================================

  const [selectedColors, setSelectedColors] =
    useState<string[]>([]);

  const [selectedSizes, setSelectedSizes] =
    useState<string[]>([]);

  const [minPrice, setMinPrice] =
    useState<string>("");

  const [maxPrice, setMaxPrice] =
    useState<string>("");

  const [sortBy, setSortBy] =
    useState<string>("");

  // =========================================
  // COLOR HANDLER
  // =========================================

  const colorHandler = (
    color: string,
    checked: boolean
  ) => {

    if (checked) {
      setSelectedColors((previous) => [
        ...previous,
        color,
      ]);
    } else {
      setSelectedColors((previous) =>
        previous.filter(
          (item) => item !== color
        )
      );
    }
  };

  // =========================================
  // SIZE HANDLER
  // =========================================

  const sizeHandler = (
    size: string,
    checked: boolean
  ) => {

    if (checked) {
      setSelectedSizes((previous) => [
        ...previous,
        size,
      ]);
    } else {
      setSelectedSizes((previous) =>
        previous.filter(
          (item) => item !== size
        )
      );
    }
  };

  // =========================================
  // FILTER + SORT FUNCTION
  // =========================================

  const filterProducts = <
    T extends {
      colors?: string[];
      sizes?: string[];
      price: number;
      rating_count?: number;
      createdAt?: string;
    }
  >(
    products: T[]
  ) => {

    // =====================================
    // FILTER
    // =====================================

    const filtered = products.filter(
      (product) => {

        // -------------------------------
        // COLOR
        // -------------------------------

        const colorMatch =
          selectedColors.length === 0 ||
          selectedColors.every(
            (selectedColor) =>
              product.colors?.some(
                (productColor) =>
                  productColor.toLowerCase() ===
                  selectedColor.toLowerCase()
              )
          );

        // -------------------------------
        // SIZE
        // -------------------------------

        const sizeMatch =
          selectedSizes.length === 0 ||
          selectedSizes.every(
            (selectedSize) =>
              product.sizes?.some(
                (productSize) =>
                  productSize.toLowerCase() ===
                  selectedSize.toLowerCase()
              )
          );

        // -------------------------------
        // MIN PRICE
        // -------------------------------

        const minPriceMatch =
          minPrice === "" ||
          product.price >= Number(minPrice);

        // -------------------------------
        // MAX PRICE
        // -------------------------------

        const maxPriceMatch =
          maxPrice === "" ||
          product.price <= Number(maxPrice);

        // -------------------------------
        // ALL MUST MATCH
        // -------------------------------

        return (
          colorMatch &&
          sizeMatch &&
          minPriceMatch &&
          maxPriceMatch
        );
      }
    );

    // =====================================
    // SORT
    // =====================================

    const sortedProducts = [...filtered];

    if (sortBy === "price-asc") {

      sortedProducts.sort(
        (a, b) => a.price - b.price
      );

    }

    if (sortBy === "price-desc") {

      sortedProducts.sort(
        (a, b) => b.price - a.price
      );

    }

    if (sortBy === "rating") {

      sortedProducts.sort(
        (a, b) =>
          (b.rating_count ?? 0) -
          (a.rating_count ?? 0)
      );

    }

    if (sortBy === "newest") {

      sortedProducts.sort(
        (a, b) =>
          new Date(
            b.createdAt ?? 0
          ).getTime() -
          new Date(
            a.createdAt ?? 0
          ).getTime()
      );

    }

    return sortedProducts;
  };

  // =========================================
  // FILTER NEW ARRIVALS
  // =========================================

  const filteredNewArrivals =
    filterProducts(newArrivals);

  // =========================================
  // FILTER FEATURED
  // =========================================

  const filteredFeatured =
    filterProducts(featured);

  // =========================================
  // CLEAR ALL FILTERS
  // =========================================

  const clearFilters = () => {

    setSelectedColors([]);

    setSelectedSizes([]);

    setMinPrice("");

    setMaxPrice("");

    setSortBy("");

  };

  // =========================================
  // LOADING
  // =========================================

  if (
    newArrivalLoading ||
    featuredLoading
  ) {

    return (
      <div className="py-20 text-center">
        Loading products...
      </div>
    );

  }

  return (

    <main className="mt-15 min-h-screen">

      <div className="max-w-6xl mx-auto">

        {/* =====================================
            MAIN GRID
        ====================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-12
            gap-8
          "
        >

          {/* ===================================
              LEFT SIDE FILTER
          ==================================== */}

          <aside className="lg:col-span-3">

            <div className="sticky top-24">

              {/* =================================
                  HEADER
              ================================== */}

              <div className="mb-6">

                <h2 className="text-xl font-semibold">
                  Product Filters
                </h2>

              </div>

              {/* =================================
                  COLORS
              ================================== */}

              <div className="mb-8">

                <p className="font-semibold mb-3">
                  Available Colors
                </p>

                <div className="flex flex-col gap-2">

                  {productMeta?.colors?.map(
                    (color) => (

                      <label
                        key={color}
                        className="
                          flex
                          items-center
                          gap-2
                          cursor-pointer
                        "
                      >

                        <input
                          type="checkbox"
                          value={color}
                          checked={
                            selectedColors.includes(
                              color
                            )
                          }
                          onChange={(e) =>
                            colorHandler(
                              color,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4"
                        />

                        <span className="capitalize">
                          {color}
                        </span>

                      </label>

                    )
                  )}

                </div>

              </div>

              {/* =================================
                  SIZES
              ================================== */}

              <div className="mb-8">

                <p className="font-semibold mb-3">
                  Available Sizes
                </p>

                <div className="flex flex-col gap-2">

                  {productMeta?.sizes?.map(
                    (size) => (

                      <label
                        key={size}
                        className="
                          flex
                          items-center
                          gap-2
                          cursor-pointer
                        "
                      >

                        <input
                          type="checkbox"
                          value={size}
                          checked={
                            selectedSizes.includes(
                              size
                            )
                          }
                          onChange={(e) =>
                            sizeHandler(
                              size,
                              e.target.checked
                            )
                          }
                          className="w-4 h-4"
                        />

                        <span className="uppercase">
                          {size}
                        </span>

                      </label>

                    )
                  )}

                </div>

              </div>

              {/* =================================
                  PRICE RANGE
              ================================== */}

              <div className="mb-8">

                <p className="font-semibold mb-3">
                  Price Range
                </p>

                <div className="flex gap-3">

                  {/* MIN PRICE */}

                  <div className="w-1/2">

                    <label
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Min Price
                    </label>

                    <input
                      type="number"
                      value={minPrice}
                      placeholder="Min"
                      min={
                        productMeta?.minPrice ??
                        undefined
                      }
                      max={
                        productMeta?.maxPrice ??
                        undefined
                      }
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        mt-1
                        border
                        rounded-md
                        px-3
                        py-2
                        outline-none
                        focus:ring-2
                        focus:ring-black
                      "
                    />

                  </div>

                  {/* MAX PRICE */}

                  <div className="w-1/2">

                    <label
                      className="
                        text-sm
                        text-gray-500
                      "
                    >
                      Max Price
                    </label>

                    <input
                      type="number"
                      value={maxPrice}
                      placeholder="Max"
                      min={
                        productMeta?.minPrice ??
                        undefined
                      }
                      max={
                        productMeta?.maxPrice ??
                        undefined
                      }
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        mt-1
                        border
                        rounded-md
                        px-3
                        py-2
                        outline-none
                        focus:ring-2
                        focus:ring-black
                      "
                    />

                  </div>

                </div>

                {/* DATABASE PRICE RANGE */}

                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-3
                  "
                >
                  Price range: $
                  {productMeta?.minPrice?.toLocaleString()
                    ?? 0}

                  {" - "}$

                  {productMeta?.maxPrice?.toLocaleString()
                    ?? 0}
                </p>

              </div>

              {/* =================================
                  SORT BY
              ================================== */}

              <div className="mb-8">

                <p className="font-semibold mb-3">
                  Sort By
                </p>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border
                    rounded-md
                    px-3
                    py-2
                    outline-none
                    cursor-pointer
                  "
                >

                  <option value="">
                    Default
                  </option>

                  <option value="price-asc">
                    Price: Low to High
                  </option>

                  <option value="price-desc">
                    Price: High to Low
                  </option>

                  <option value="newest">
                    Newest
                  </option>

                  <option value="rating">
                    Rating
                  </option>

                </select>

              </div>

              {/* =================================
                  SELECTED FILTER INFO
              ================================== */}

              {(selectedColors.length > 0 ||
                selectedSizes.length > 0 ||
                minPrice !== "" ||
                maxPrice !== "" ||
                sortBy !== "") && (

                <div
                  className="
                    border-t
                    pt-4
                    mb-5
                    text-sm
                  "
                >

                  <p className="font-semibold mb-2">
                    Selected Filters
                  </p>

                  {selectedColors.length > 0 && (

                    <p className="text-gray-600">
                      Color:{" "}
                      {selectedColors.join(", ")}
                    </p>

                  )}

                  {selectedSizes.length > 0 && (

                    <p className="text-gray-600">
                      Size:{" "}
                      {selectedSizes.join(", ")}
                    </p>

                  )}

                  {minPrice && (

                    <p className="text-gray-600">
                      Min Price: ${minPrice}
                    </p>

                  )}

                  {maxPrice && (

                    <p className="text-gray-600">
                      Max Price: ${maxPrice}
                    </p>

                  )}

                </div>

              )}

              {/* =================================
                  CLEAR FILTER BUTTON
                  အောက်ဆုံးမှာထားမယ်
              ================================== */}

              <button
                type="button"
                onClick={clearFilters}
                className="
                  w-full
                  border
                  border-black
                  rounded-md
                  px-4
                  py-2
                  text-sm
                  font-medium
                  cursor-pointer
                  hover:bg-black
                  hover:text-white
                  transition
                "
              >
                Clear Filters
              </button>

            </div>

          </aside>

          {/* ===================================
              RIGHT SIDE PRODUCTS
          ==================================== */}

          <div className="lg:col-span-9">

            {/* =================================
                NEW ARRIVALS
            ================================== */}

            <section>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <h2 className="text-2xl font-bold">
                  New Arrivals
                </h2>

                <p className="text-sm text-gray-500">
                  {filteredNewArrivals.length} products
                </p>

              </div>

              {filteredNewArrivals.length > 0 ? (

                <ProductList
                  products={
                    filteredNewArrivals
                  }
                />

              ) : (

                <div
                  className="
                    border
                    rounded-lg
                    py-16
                    text-center
                  "
                >

                  <h3 className="font-semibold text-lg">
                    No products found
                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-2
                    "
                  >
                    No New Arrival products match
                    the selected filters.
                  </p>

                </div>

              )}

            </section>

            {/* =================================
                FEATURED
            ================================== */}

            <section className="mt-12">

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <h2 className="text-2xl font-bold">
                  Featured
                </h2>

                <p className="text-sm text-gray-500">
                  {filteredFeatured.length} products
                </p>

              </div>

              {filteredFeatured.length > 0 ? (

                <ProductList
                  products={
                    filteredFeatured
                  }
                />

              ) : (

                <div
                  className="
                    border
                    rounded-lg
                    py-16
                    text-center
                  "
                >

                  <h3 className="font-semibold text-lg">
                    No products found
                  </h3>

                  <p
                    className="
                      text-sm
                      text-gray-500
                      mt-2
                    "
                  >
                    No Featured products match
                    the selected filters.
                  </p>

                </div>

              )}

            </section>

          </div>

        </div>

      </div>

    </main>

  );
}

export default Home;