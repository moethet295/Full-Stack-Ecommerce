import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useGetProductsQuery,
} from "@/store/slices/productApiSlice";

import {
  Link,
} from "react-router-dom";

import {
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import ProductStatus from "./ProductStatus";

import ProductTable from "@/component/product/ProductTable";


function ProductManagement() {

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
  // PRODUCT STATUS
  // =====================================

  const totalProducts =
    products.length;


  const inStockProducts =
    products.filter(
      (product) =>
        product.instock_count > 0
    ).length;


  const outOfStockProducts =
    products.filter(
      (product) =>
        product.instock_count === 0
    ).length;


  // =====================================
  // RETURN
  // =====================================

  return (

    <div className="space-y-6">


      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div
        className="
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
            "
          >
            Products
          </h1>


          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            Manage your product inventory and take action
          </p>

        </div>


        {/* ================================= */}
        {/* ACTION BUTTONS */}
        {/* ================================= */}

        <div
          className="
            flex
            w-full
            flex-col
            gap-2
            sm:w-auto
          "
        >


          {/* CREATE PRODUCT */}

          <Link
            to="/admin/create-product"
            className="
              inline-flex
              h-10
              min-w-47.5
              items-center
              justify-center
              gap-2
              rounded-md
              bg-primary
              px-4
              text-sm
              font-medium
              text-primary-foreground
              shadow-sm
              transition-colors
              hover:bg-primary/90
            "
          >

            <Plus className="h-4 w-4" />

            Create New Product

          </Link>


          {/* UPDATE PRODUCT */}

          <Link
            to="/admin/update-product"
            className="
              inline-flex
              h-10
              min-w-47.5
              items-center
              justify-center
              gap-2
              rounded-md
              bg-blue-600
              px-4
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-colors
              hover:bg-blue-700
            "
          >

            <Pencil className="h-4 w-4" />

            Update Product

          </Link>


          {/* DELETE PRODUCT */}

          <Link
            to="/admin/delete-product"
            className="
              inline-flex
              h-10
              min-w-47.5
              items-center
              justify-center
              gap-2
              rounded-md
              bg-red-600
              px-4
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-colors
              hover:bg-red-700
            "
          >

            <Trash2 className="h-4 w-4" />

            Delete Product

          </Link>

        </div>

      </div>


      {/* ================================= */}
      {/* STATUS CARDS */}
      {/* ================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-3
        "
      >

        <ProductStatus
          title="Total Products"
          isLoading={isLoading}
          value={totalProducts}
        />


        <ProductStatus
          title="In Stock"
          iconColor="text-green-500"
          isLoading={isLoading}
          value={inStockProducts}
        />


        <ProductStatus
          title="Out of Stock"
          iconColor="text-red-500"
          isLoading={isLoading}
          value={outOfStockProducts}
        />

      </div>


      {/* ================================= */}
      {/* PRODUCT INVENTORY */}
      {/* ================================= */}

      <Card className="overflow-hidden">

        <CardHeader
          className="
            px-4
            py-3
          "
        >

          <CardTitle
            className="
              text-base
              font-semibold
            "
          >
            Product Inventory
          </CardTitle>


          <CardDescription className="text-xs">
            Manage and sort your products
          </CardDescription>

        </CardHeader>


        <CardContent
          className="
            px-4
            pb-4
            pt-0
          "
        >

          {isLoading ? (

            <div
              className="
                flex
                h-24
                items-center
                justify-center
              "
            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Loading products...
              </p>

            </div>

          ) : products.length === 0 ? (

            <div
              className="
                flex
                h-24
                items-center
                justify-center
              "
            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                No products available.
              </p>

            </div>

          ) : (

            <ProductTable
              data={products}
            />

          )}

        </CardContent>

      </Card>

    </div>

  );

}


export default ProductManagement;