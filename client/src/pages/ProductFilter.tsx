import {
  useGetProductsMetaQuery,
  useGetProductsQuery,
} from "@/store/slices/productApiSlice";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

interface ProductFilters {
  keyword: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sizes: string[];
  colors: string[];
  sortBy: string;
}

function ProductFilter() {
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================
  // GET FILTERS FROM URL
  // =========================================
  const getFiltersFromURL = (): ProductFilters => {
    const params = new URLSearchParams(location.search);

    return {
      keyword: params.get("keyword") || "",
      category: params.get("category") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      sizes: params.getAll("sizes"),
      colors: params.getAll("colors"),
      sortBy: params.get("sortBy") || "",
    };
  };

  const filters = getFiltersFromURL();

  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sortBy,
  } = filters;

  // =========================================
  // GET PRODUCTS
  // =========================================
  const {
    data: products = [],
    isLoading,
    isError,
  } = useGetProductsQuery({
    keyword,
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sortBy,
  });

  // =========================================
  // GET PRODUCT META
  // =========================================
  const {
    data: product_meta,
    isLoading: metaLoading,
    isError: metaError,
  } = useGetProductsMetaQuery();

  // =========================================
  // FILTER PRODUCTS
  //
  // ရွေးထားတဲ့ color / size က
  // product မူရင်း data ထဲမှာ မရှိရင်
  // product ကို UI မှာ မပြဘူး
  // =========================================
  const filteredProducts = products.filter((product) => {
    // -----------------------------------------
    // COLOR CHECK
    // -----------------------------------------
    const colorMatch =
      colors.length === 0 ||
      colors.every((selectedColor) =>
        product.colors?.some(
          (productColor) =>
            productColor.toLowerCase() ===
            selectedColor.toLowerCase()
        )
      );

    // -----------------------------------------
    // SIZE CHECK
    // -----------------------------------------
    const sizeMatch =
      sizes.length === 0 ||
      sizes.every((selectedSize) =>
        product.sizes?.some(
          (productSize) =>
            productSize.toLowerCase() ===
            selectedSize.toLowerCase()
        )
      );

    // Color + Size နှစ်ခုလုံး match ဖြစ်မှ ပြမယ်
    return colorMatch && sizeMatch;
  });

  // =========================================
  // UPDATE QUERY PARAMS
  // =========================================
  const updateQueryParams = (
    key: string,
    value: string,
    checked?: boolean
  ) => {
    const params = new URLSearchParams(location.search);

    // =====================================
    // COLORS / SIZES CHECKBOX
    // =====================================
    if (key === "colors" || key === "sizes") {
      const currentValues = params.getAll(key);

      // CHECK
      if (checked) {
        if (!currentValues.includes(value)) {
          params.append(key, value);
        }
      }

      // UNCHECK
      else {
        params.delete(key);

        currentValues
          .filter((item) => item !== value)
          .forEach((item) => {
            params.append(key, item);
          });
      }
    }

    // =====================================
    // PRICE / SORT
    // =====================================
    else {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  // =========================================
  // CLEAR FILTERS
  // =========================================
  const clearFilters = () => {
    const params = new URLSearchParams(location.search);

    params.delete("sizes");
    params.delete("colors");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("sortBy");

    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
  };

  // =========================================
  // LOADING
  // =========================================
  if (isLoading || metaLoading) {
    return (
      <div className="py-10 text-center">
        Loading...
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================
  if (isError || metaError) {
    return (
      <div className="py-10 text-center text-red-500">
        Something went wrong
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

      {/* =========================================
          FILTER SIDEBAR
      ========================================= */}
      <div className="lg:col-span-3">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Product Filters
          </h2>
        </div>

        {/* =========================================
            COLORS
        ========================================= */}
        <div className="mb-8">

          <p className="mb-3 font-semibold">
            Available Colors
          </p>

          <div className="flex flex-col gap-2">

            {product_meta?.colors?.map((color) => (
              <label
                key={color}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={color}
                  checked={colors.includes(color)}
                  onChange={(e) =>
                    updateQueryParams(
                      "colors",
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
            ))}

          </div>
        </div>

        {/* =========================================
            SIZES
        ========================================= */}
        <div className="mb-8">

          <p className="mb-3 font-semibold">
            Available Sizes
          </p>

          <div className="flex flex-col gap-2">

            {product_meta?.sizes?.map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={size}
                  checked={sizes.includes(size)}
                  onChange={(e) =>
                    updateQueryParams(
                      "sizes",
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
            ))}

          </div>
        </div>

        {/* =========================================
            PRICE RANGE
        ========================================= */}
        <div className="mb-8">

          <p className="mb-3 font-semibold">
            Price Range
          </p>

          <div className="flex gap-3">

            {/* MIN PRICE */}
            <div className="w-1/2">

              <label className="text-sm text-gray-500">
                Min Price
              </label>

              <input
                type="number"
                value={minPrice}
                placeholder="Min"
                min={product_meta?.minPrice ?? undefined}
                max={product_meta?.maxPrice ?? undefined}
                onChange={(e) =>
                  updateQueryParams(
                    "minPrice",
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

              <label className="text-sm text-gray-500">
                Max Price
              </label>

              <input
                type="number"
                value={maxPrice}
                placeholder="Max"
                min={product_meta?.minPrice ?? undefined}
                max={product_meta?.maxPrice ?? undefined}
                onChange={(e) =>
                  updateQueryParams(
                    "maxPrice",
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
          <p className="text-xs text-gray-500 mt-3">
            Price range: $
            {product_meta?.minPrice?.toLocaleString() ?? 0}
            {" - "}$
            {product_meta?.maxPrice?.toLocaleString() ?? 0}
          </p>

        </div>

        {/* =========================================
            SORT
        ========================================= */}
        <div className="mb-8">

          <p className="mb-3 font-semibold">
            Sort By
          </p>

          <select
            value={sortBy}
            onChange={(e) =>
              updateQueryParams(
                "sortBy",
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
        <button
            type="button"
            onClick={clearFilters}
            className="text-sm underline cursor-pointer"
          >
            Clear
       </button>

      </div>

      {/* =========================================
          PRODUCT SECTION
      ========================================= */}
      <div className="lg:col-span-9">

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-6">

          {category
            ? `Category: ${category}`
            : keyword
            ? `Search Results for "${keyword}"`
            : "All Products"}

        </h1>

        {/* =========================================
            NO MATCHING PRODUCTS
        ========================================= */}
        {filteredProducts.length === 0 ? (

          <div className="py-16 text-center">

            <h2 className="text-xl font-semibold">
              No products found
            </h2>

            {(colors.length > 0 || sizes.length > 0) && (
              <p className="mt-2 text-gray-500">
                No products have the selected color and size.
              </p>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="
                mt-5
                px-5
                py-2
                border
                rounded-md
                cursor-pointer
              "
            >
              Clear Filters
            </button>

          </div>

        ) : (

          /* =========================================
              PRODUCT GRID
          ========================================= */
          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
              gap-6
            "
          >

            {filteredProducts.map((product) => (

              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="block"
              >

                {/* PRODUCT IMAGE */}
                <img
                  src={
                    product.images?.[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={product.name}
                  className="
                    w-full
                    aspect-3/4
                    object-cover
                    rounded-lg
                  "
                />

                {/* PRODUCT NAME */}
                <h2 className="mt-2 text-sm font-semibold">
                  {product.name}
                </h2>

                {/* PRODUCT PRICE */}
                <p className="mt-1 text-sm font-bold">
                  ${product.price.toLocaleString()}
                </p>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default ProductFilter;