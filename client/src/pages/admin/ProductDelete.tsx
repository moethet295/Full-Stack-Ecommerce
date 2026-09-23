import {
  AlertTriangle,
  Loader2,
  Package,
  Trash2,
} from "lucide-react";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/slices/productApiSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


function ProductDelete() {

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
  // DELETE MUTATION
  // =====================================

  const [
    deleteProduct,
    {
      isLoading: isDeleting,
    },
  ] = useDeleteProductMutation();


  // =====================================
  // DELETE PRODUCT
  // =====================================

  const handleDelete = async (
    productId: string,
    productName: string
  ) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${productName}"?`
      );


    if (!confirmed) {
      return;
    }


    try {

      await deleteProduct(
        productId
      ).unwrap();


      alert(
        `${productName} deleted successfully.`
      );


    } catch (error) {

      console.error(
        "Delete product error:",
        error
      );


      alert(
        "Failed to delete product."
      );

    }

  };


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (

      <Card>

        <CardContent
          className="
            flex
            min-h-52
            flex-col
            items-center
            justify-center
            gap-3
          "
        >

          <AlertTriangle
            className="
              h-7
              w-7
              text-red-500
            "
          />

          <p className="font-medium">
            Failed to load products
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

        </CardContent>

      </Card>

    );

  }


  // =====================================
  // RETURN
  // =====================================

  return (

    <div className="space-y-6">


      {/* HEADER */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Delete Product
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          Select a product you want to permanently delete.
        </p>

      </div>


      {/* WARNING */}

      <div
        className="
          flex
          items-start
          gap-3
          rounded-lg
          border
          border-red-200
          bg-red-50
          p-4
          text-red-700
        "
      >

        <AlertTriangle
          className="
            mt-0.5
            h-5
            w-5
            shrink-0
          "
        />

        <div>

          <p className="text-sm font-semibold">
            Warning
          </p>

          <p className="mt-1 text-sm">
            Deleted products cannot be recovered.
          </p>

        </div>

      </div>


      {/* PRODUCT LIST */}

      <Card>

        <CardHeader>

          <CardTitle>
            Products
          </CardTitle>

          <CardDescription>
            {products.length} products available
          </CardDescription>

        </CardHeader>


        <CardContent>

          {isLoading ? (

            <div
              className="
                flex
                h-40
                items-center
                justify-center
              "
            >

              <Loader2
                className="
                  h-6
                  w-6
                  animate-spin
                "
              />

            </div>

          ) : products.length === 0 ? (

            <div
              className="
                flex
                min-h-52
                flex-col
                items-center
                justify-center
                text-center
              "
            >

              <Package
                className="
                  mb-3
                  h-8
                  w-8
                  text-muted-foreground
                "
              />

              <p className="font-medium">
                No products available
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                There are no products to delete.
              </p>

            </div>

          ) : (

            <div className="divide-y">

              {products.map(
                (product) => (

                  <div
                    key={product._id}
                    className="
                      flex
                      flex-col
                      gap-4
                      py-4
                      first:pt-0
                      last:pb-0
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >


                    {/* PRODUCT INFO */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-4
                      "
                    >


                      {/* IMAGE */}

                      {product.images &&
                      product.images.length > 0 ? (

                        <img
                          src={
                            product.images[0].url
                          }
                          alt={
                            product.name
                          }
                          className="
                            h-16
                            w-16
                            shrink-0
                            rounded-lg
                            border
                            object-cover
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex
                            h-16
                            w-16
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            bg-muted
                          "
                        >

                          <Package
                            className="
                              h-6
                              w-6
                              text-muted-foreground
                            "
                          />

                        </div>

                      )}


                      {/* DETAILS */}

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            font-semibold
                          "
                        >
                          {product.name}
                        </p>


                        <p
                          className="
                            mt-1
                            text-sm
                            capitalize
                            text-muted-foreground
                          "
                        >
                          {product.category}
                        </p>


                        <div
                          className="
                            mt-2
                            flex
                            flex-wrap
                            items-center
                            gap-4
                            text-sm
                          "
                        >

                          <span className="font-medium">
                            $
                            {product.price.toLocaleString()}
                          </span>


                          <span
                            className="
                              text-muted-foreground
                            "
                          >
                            Stock:{" "}
                            {product.instock_count}
                          </span>

                        </div>

                      </div>

                    </div>


                    {/* DELETE BUTTON */}

                    <button
                      type="button"

                      disabled={isDeleting}

                      onClick={() =>
                        handleDelete(
                          product._id,
                          product.name
                        )
                      }

                      className="
                        inline-flex
                        h-9
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-md
                        bg-red-600
                        px-4
                        text-sm
                        font-medium
                        text-white
                        transition-colors
                        hover:bg-red-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      {isDeleting ? (

                        <Loader2
                          className="
                            h-4
                            w-4
                            animate-spin
                          "
                        />

                      ) : (

                        <Trash2
                          className="
                            h-4
                            w-4
                          "
                        />

                      )}

                      Delete

                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </CardContent>

      </Card>

    </div>

  );

}


export default ProductDelete;