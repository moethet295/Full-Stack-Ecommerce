import {
  useGetProductsQuery,
} from "@/store/slices/productApiSlice";

import {
  Link,
} from "react-router-dom";

import {
  Pencil,
  Package,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


function ProductUpdateList() {

  // =====================================
  // GET PRODUCTS
  // =====================================

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({});


  // =====================================
  // LOADING
  // =====================================

  if (isLoading) {

    return (

      <div
        className="
          flex
          min-h-[300px]
          items-center
          justify-center
        "
      >

        <p className="text-muted-foreground">
          Loading products...
        </p>

      </div>

    );

  }


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (

      <div className="p-6">

        <Card>

          <CardContent className="pt-6">

            <div
              className="
                flex
                flex-col
                items-start
                gap-3
              "
            >

              <p className="text-red-500">
                Failed to load products.
              </p>


              <button
                type="button"
                onClick={() => refetch()}
                className="
                  rounded-md
                  bg-primary
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-primary-foreground
                "
              >
                Try Again
              </button>

            </div>

          </CardContent>

        </Card>

      </div>

    );

  }


  // =====================================
  // RETURN
  // =====================================

  return (

    <div className="space-y-6">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Update Product
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          Select a product you want to update
        </p>

      </div>


      {/* ================================= */}
      {/* PRODUCT LIST */}
      {/* ================================= */}

      <Card>

        <CardHeader>

          <CardTitle
            className="
              flex
              items-center
              gap-2
            "
          >

            <Package className="h-5 w-5" />

            Products

          </CardTitle>


          <CardDescription>
            Choose a product and click Edit
          </CardDescription>

        </CardHeader>


        <CardContent>


          {/* EMPTY */}

          {products.length === 0 ? (

            <div
              className="
                flex
                min-h-[200px]
                items-center
                justify-center
              "
            >

              <p className="text-muted-foreground">
                No products available.
              </p>

            </div>

          ) : (

            <div
              className="
                divide-y
                rounded-md
                border
              "
            >

              {products.map((product) => {

                const imageUrl =
                  product.images?.[0]?.url;


                return (

                  <div
                    key={product._id}
                    className="
                      flex
                      flex-col
                      gap-4
                      p-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >


                    {/* PRODUCT INFORMATION */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                      "
                    >


                      {/* IMAGE */}

                      <div
                        className="
                          flex
                          h-16
                          w-16
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-md
                          border
                          bg-muted
                        "
                      >

                        {imageUrl ? (

                          <img
                            src={imageUrl}
                            alt={
                              product.images?.[0]
                                ?.public_alt ||
                              product.name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />

                        ) : (

                          <Package
                            className="
                              h-6
                              w-6
                              text-muted-foreground
                            "
                          />

                        )}

                      </div>


                      {/* DETAILS */}

                      <div className="min-w-0">

                        <h3
                          className="
                            truncate
                            font-semibold
                          "
                        >
                          {product.name}
                        </h3>


                        <p
                          className="
                            mt-1
                            text-sm
                            text-muted-foreground
                          "
                        >
                          Category: {product.category}
                        </p>


                        <div
                          className="
                            mt-1
                            flex
                            flex-wrap
                            gap-x-4
                            gap-y-1
                            text-sm
                            text-muted-foreground
                          "
                        >

                          <span>
                            Price: ${product.price}
                          </span>

                          <span>
                            Stock: {product.instock_count}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* EDIT BUTTON */}

                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      className="
                        inline-flex
                        h-9
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-md
                        bg-blue-600
                        px-4
                        text-sm
                        font-medium
                        text-white
                        transition-colors
                        hover:bg-blue-700
                      "
                    >

                      <Pencil className="h-4 w-4" />

                      Edit

                    </Link>

                  </div>

                );

              })}

            </div>

          )}

        </CardContent>

      </Card>

    </div>

  );

}


export default ProductUpdateList;