import type {
  Product,
} from "@/types/product";

import {
  createColumnHelper,
  tableFeatures,
} from "@tanstack/react-table";


// =====================================
// TABLE FEATURES
// =====================================

export const productTableFeatures =
  tableFeatures({});


// =====================================
// COLUMN HELPER
// =====================================

const columnHelper =
  createColumnHelper<
    typeof productTableFeatures,
    Product
  >();


// =====================================
// PRODUCT COLUMNS
// =====================================

function useProductColumns() { 

  const columns =
    columnHelper.columns([


      // ===================================
      // PRODUCT NAME + IMAGE
      // ===================================

      columnHelper.accessor(
        "name",
        {

          header:
            "Product Name",

          cell: (info) => {

            const product =
              info.row.original;

            const images =
              product.images || [];


            return (

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                {/* PRODUCT IMAGE */}

                <div
                  className="
                    relative
                    h-10
                    w-12
                    shrink-0
                  "
                >

                  {/* MORE IMAGES */}

                  {images.length > 1 && (

                    <div
                      className="
                        absolute
                        left-3
                        top-1/2
                        z-0
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-end
                        rounded-full
                        border-2
                        border-white
                        bg-gray-200
                        pr-1
                        text-[11px]
                        font-bold
                        text-gray-600
                        shadow-sm
                      "
                    >
                      ...
                    </div>

                  )}


                  {/* FIRST IMAGE */}

                  {images.length > 0 ? (

                    <img
                      src={
                        images[0].url
                      }

                      alt={
                        product.name
                      }

                      className="
                        relative
                        z-10
                        h-10
                        w-10
                        rounded-full
                        border-2
                        border-white
                        object-cover
                        shadow-sm
                      "
                    />

                  ) : (

                    <div
                      className="
                        relative
                        z-10
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        bg-muted
                        text-[9px]
                        text-muted-foreground
                      "
                    >
                      N/A
                    </div>

                  )}

                </div>


                {/* PRODUCT NAME */}

                <div
                  className="
                    flex
                    min-w-0
                    flex-col
                  "
                >

                  <span
                    className="
                      max-w-55
                      truncate
                      text-sm
                      font-medium
                      text-foreground
                    "
                  >
                    {product.name}
                  </span>


                  {images.length > 1 && (

                    <span
                      className="
                        text-[11px]
                        text-muted-foreground
                      "
                    >
                      {images.length} images
                    </span>

                  )}

                </div>

              </div>

            );

          },

        }
      ),


      // ===================================
      // CATEGORY
      // ===================================

      columnHelper.accessor(
        "category",
        {

          header:
            "Category",

          cell: (info) => {

            const category =
              info.getValue();


            return (

              <span
                className="
                  inline-flex
                  rounded-md
                  bg-muted
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  capitalize
                  text-muted-foreground
                "
              >
                {category}
              </span>

            );

          },

        }
      ),


      // ===================================
      // PRICE
      // ===================================

      columnHelper.accessor(
        "price",
        {

          header:
            "Price",

          cell: (info) => {

            const price =
              info.getValue();


            return (

              <span
                className="
                  whitespace-nowrap
                  text-sm
                  font-semibold
                "
              >
                ${price.toLocaleString()}
              </span>

            );

          },

        }
      ),


      // ===================================
      // STOCK
      // ===================================

      columnHelper.accessor(
        "instock_count",
        {

          header:
            "Stock",

          cell: (info) => {

            const stock =
              info.getValue();


            return (

              <span
                className="
                  text-sm
                  font-medium
                "
              >
                {stock}
              </span>

            );

          },

        }
      ),


      // ===================================
      // STATUS
      // ===================================

      columnHelper.accessor(
        "instock_count",
        {

          id:
            "status",

          header:
            "Status",

          cell: (info) => {

            const stock =
              info.getValue();


            if (stock > 0) {

              return (

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    whitespace-nowrap
                    rounded-full
                    bg-green-50
                    px-2.5
                    py-1
                    text-xs
                    font-medium
                    text-green-700
                    dark:bg-green-950/40
                    dark:text-green-400
                  "
                >

                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-green-500
                    "
                  />

                  In Stock

                </span>

              );

            }


            return (

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  whitespace-nowrap
                  rounded-full
                  bg-red-50
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-red-700
                  dark:bg-red-950/40
                  dark:text-red-400
                "
              >

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-red-500
                  "
                />

                Out of Stock

              </span>

            );

          },

        }
      ),


      // ===================================
      // CREATED DATE
      // ===================================

      columnHelper.accessor(
        "createdAt",
        {

          header:
            "Created Date",

          cell: (info) => {

            const createdAt =
              info.getValue();


            if (!createdAt) {

              return (

                <span
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  —
                </span>

              );

            }


            const date =
              new Date(
                createdAt
              );


            return (

              <div
                className="
                  flex
                  flex-col
                  whitespace-nowrap
                "
              >

                <span
                  className="
                    text-sm
                    font-medium
                  "
                >

                  {date.toLocaleDateString(
                    "en-US",
                    {
                      day:
                        "2-digit",

                      month:
                        "short",

                      year:
                        "numeric",
                    }
                  )}

                </span>


                <span
                  className="
                    text-[11px]
                    text-muted-foreground
                  "
                >

                  {date.toLocaleTimeString(
                    "en-US",
                    {
                      hour:
                        "2-digit",

                      minute:
                        "2-digit",
                    }
                  )}

                </span>

              </div>

            );

          },

        }
      ),

    ]);


  return columns;

}


export default useProductColumns;