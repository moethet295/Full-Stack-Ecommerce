import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertTriangle,
  Boxes,
  CircleDollarSign,
  Package,
  PackageCheck,
  PackageX,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useGetProductsQuery,
} from "@/store/slices/productApiSlice";

import ProductChart from "@/component/product/ProductChart";
import OrderTable from "@/component/product/OrderTable";


function DashBorad() {

  // =====================================
  // GET PRODUCTS
  // =====================================

  const {
    data: products = [],
    isLoading,
    error,
  } = useGetProductsQuery({});


  // =====================================
  // PRODUCT STATISTICS
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
  // TOTAL STOCK
  // =====================================

  const totalStock =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        product.instock_count,
      0
    );


  // =====================================
  // TOTAL INVENTORY VALUE
  // =====================================

  const inventoryValue =
    products.reduce(
      (
        total,
        product
      ) =>
        total +
        (
          product.price *
          product.instock_count
        ),
      0
    );


  // =====================================
  // LOW STOCK
  // 1 - 5 ITEMS
  // =====================================

  const lowStockProducts =
    products.filter(
      (product) =>
        product.instock_count > 0 &&
        product.instock_count <= 5
    );


  // =====================================
  // RECENT PRODUCTS
  // =====================================

  const recentProducts =
    [...products]
      .sort(
        (a, b) => {

          const aTime =
            a.createdAt
              ? new Date(
                  a.createdAt
                ).getTime()
              : 0;


          const bTime =
            b.createdAt
              ? new Date(
                  b.createdAt
                ).getTime()
              : 0;


          return (
            bTime -
            aTime
          );

        }
      )
      .slice(0, 5);


  // =====================================
  // ERROR
  // =====================================

  if (error) {

    return (

      <div className="p-6">

        <Card>

          <CardContent
            className="
              flex
              min-h-40
              items-center
              justify-center
            "
          >

            <div className="text-center">

              <AlertTriangle
                className="
                  mx-auto
                  mb-3
                  h-6
                  w-6
                  text-red-500
                "
              />

              <p className="font-medium">
                Failed to load dashboard
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                Unable to load product data.
              </p>

            </div>

          </CardContent>

        </Card>

      </div>

    );

  }


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
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
            "
          >
            Dashboard
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            Overview of your store and product inventory
          </p>

        </div>

      </div>


      {/* ================================= */}
      {/* MAIN STAT CARDS */}
      {/* ================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >


        {/* TOTAL PRODUCTS */}

        <Card>

          <CardHeader
            className="
              flex
              flex-row
              items-center
              justify-between
              space-y-0
              pb-2
            "
          >

            <CardTitle
              className="
                text-sm
                font-medium
              "
            >
              Total Products
            </CardTitle>

            <Package
              className="
                h-4
                w-4
                text-muted-foreground
              "
            />

          </CardHeader>


          <CardContent>

            {isLoading ? (

              <div
                className="
                  h-8
                  w-16
                  animate-pulse
                  rounded
                  bg-muted
                "
              />

            ) : (

              <>

                <div
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  {totalProducts}
                </div>

                <p
                  className="
                    mt-1
                    text-xs
                    text-muted-foreground
                  "
                >
                  Products in your store
                </p>

              </>

            )}

          </CardContent>

        </Card>


        {/* IN STOCK */}

        <Card>

          <CardHeader
            className="
              flex
              flex-row
              items-center
              justify-between
              space-y-0
              pb-2
            "
          >

            <CardTitle
              className="
                text-sm
                font-medium
              "
            >
              In Stock
            </CardTitle>

            <PackageCheck
              className="
                h-4
                w-4
                text-green-500
              "
            />

          </CardHeader>


          <CardContent>

            {isLoading ? (

              <div
                className="
                  h-8
                  w-16
                  animate-pulse
                  rounded
                  bg-muted
                "
              />

            ) : (

              <>

                <div
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  {inStockProducts}
                </div>

                <p
                  className="
                    mt-1
                    text-xs
                    text-muted-foreground
                  "
                >
                  Available products
                </p>

              </>

            )}

          </CardContent>

        </Card>


        {/* OUT OF STOCK */}

        <Card>

          <CardHeader
            className="
              flex
              flex-row
              items-center
              justify-between
              space-y-0
              pb-2
            "
          >

            <CardTitle
              className="
                text-sm
                font-medium
              "
            >
              Out of Stock
            </CardTitle>

            <PackageX
              className="
                h-4
                w-4
                text-red-500
              "
            />

          </CardHeader>


          <CardContent>

            {isLoading ? (

              <div
                className="
                  h-8
                  w-16
                  animate-pulse
                  rounded
                  bg-muted
                "
              />

            ) : (

              <>

                <div
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  {outOfStockProducts}
                </div>

                <p
                  className="
                    mt-1
                    text-xs
                    text-muted-foreground
                  "
                >
                  Need restocking
                </p>

              </>

            )}

          </CardContent>

        </Card>


        {/* TOTAL STOCK */}

        <Card>

          <CardHeader
            className="
              flex
              flex-row
              items-center
              justify-between
              space-y-0
              pb-2
            "
          >

            <CardTitle
              className="
                text-sm
                font-medium
              "
            >
              Total Stock
            </CardTitle>

            <Boxes
              className="
                h-4
                w-4
                text-muted-foreground
              "
            />

          </CardHeader>


          <CardContent>

            {isLoading ? (

              <div
                className="
                  h-8
                  w-16
                  animate-pulse
                  rounded
                  bg-muted
                "
              />

            ) : (

              <>

                <div
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  {totalStock}
                </div>

                <p
                  className="
                    mt-1
                    text-xs
                    text-muted-foreground
                  "
                >
                  Units in inventory
                </p>

              </>

            )}

          </CardContent>

        </Card>

      </div>


      {/* ================================= */}
      {/* SECOND ROW */}
      {/* ================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          xl:grid-cols-3
        "
      >


        {/* ================================= */}
        {/* PRODUCT CHART */}
        {/* ================================= */}

        <div className="xl:col-span-2">

          <ProductChart
            products={
              products
            }
          />

        </div>


        {/* ================================= */}
        {/* INVENTORY SUMMARY */}
        {/* ================================= */}

        <Card>

          <CardHeader>

            <CardTitle>
              Inventory Summary
            </CardTitle>

            <CardDescription>
              Current inventory overview
            </CardDescription>

          </CardHeader>


          <CardContent
            className="
              space-y-5
            "
          >


            {/* INVENTORY VALUE */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                pb-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-muted
                  "
                >

                  <CircleDollarSign
                    className="
                      h-4
                      w-4
                    "
                  />

                </div>


                <div>

                  <p
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    Inventory Value
                  </p>

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    Price × stock
                  </p>

                </div>

              </div>


              <p
                className="
                  text-sm
                  font-bold
                "
              >
                $
                {inventoryValue
                  .toLocaleString()}
              </p>

            </div>


            {/* LOW STOCK */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                pb-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-muted
                  "
                >

                  <AlertTriangle
                    className="
                      h-4
                      w-4
                      text-orange-500
                    "
                  />

                </div>


                <div>

                  <p
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    Low Stock
                  </p>

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    5 units or less
                  </p>

                </div>

              </div>


              <p
                className="
                  text-sm
                  font-bold
                "
              >
                {lowStockProducts.length}
              </p>

            </div>


            {/* OUT OF STOCK */}

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    bg-muted
                  "
                >

                  <PackageX
                    className="
                      h-4
                      w-4
                      text-red-500
                    "
                  />

                </div>


                <div>

                  <p
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    Out of Stock
                  </p>

                  <p
                    className="
                      text-xs
                      text-muted-foreground
                    "
                  >
                    No units available
                  </p>

                </div>

              </div>


              <p
                className="
                  text-sm
                  font-bold
                "
              >
                {outOfStockProducts}
              </p>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* ================================= */}
      {/* RECENT PRODUCTS */}
      {/* ================================= */}

      <Card>

        <CardHeader
          className="
            flex
            flex-row
            items-center
            justify-between
          "
        >

          <div>

            <CardTitle>
              Recent Products
            </CardTitle>

            <CardDescription
              className="
                mt-1
              "
            >
              Recently added products
            </CardDescription>

          </div>


          <Link
            to="/admin/manage-products"
            className="
              text-sm
              font-medium
              text-muted-foreground
              transition-colors
              hover:text-foreground
            "
          >
            View all
          </Link>

        </CardHeader>


        <CardContent>

          {recentProducts.length > 0 ? (

            <div
              className="
                divide-y
              "
            >

              {recentProducts.map(
                (
                  product
                ) => (

                  <div
                    key={
                      product._id
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      py-3
                      first:pt-0
                      last:pb-0
                    "
                  >


                    {/* PRODUCT */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >


                      {/* IMAGE */}

                      {product.images &&
                      product.images.length > 0 ? (

                        <img
                          src={
                            product
                              .images[0]
                              .url
                          }
                          alt={
                            product.name
                          }
                          className="
                            h-10
                            w-10
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
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-muted
                          "
                        >

                          <Package
                            className="
                              h-4
                              w-4
                              text-muted-foreground
                            "
                          />

                        </div>

                      )}


                      {/* NAME */}

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-sm
                            font-medium
                          "
                        >
                          {product.name}
                        </p>

                        <p
                          className="
                            text-xs
                            capitalize
                            text-muted-foreground
                          "
                        >
                          {product.category}
                        </p>

                      </div>

                    </div>


                    {/* PRICE + STOCK */}

                    <div
                      className="
                        flex
                        shrink-0
                        items-center
                        gap-6
                      "
                    >

                      <div
                        className="
                          hidden
                          text-right
                          sm:block
                        "
                      >

                        <p
                          className="
                            text-sm
                            font-semibold
                          "
                        >
                          $
                          {product.price
                            .toLocaleString()}
                        </p>

                        <p
                          className="
                            text-xs
                            text-muted-foreground
                          "
                        >
                          Price
                        </p>

                      </div>


                      {/* STATUS */}

                      {product.instock_count > 0 ? (

                        <span
                          className="
                            inline-flex
                            whitespace-nowrap
                            rounded-full
                            bg-green-50
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-green-700
                          "
                        >
                          {product.instock_count}{" "}
                          in stock
                        </span>

                      ) : (

                        <span
                          className="
                            inline-flex
                            whitespace-nowrap
                            rounded-full
                            bg-red-50
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            text-red-700
                          "
                        >
                          Out of stock
                        </span>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div
              className="
                flex
                h-32
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

          )}

        </CardContent>

      </Card>


      {/* ================================= */}
      {/* ORDER TABLE */}
      {/* ================================= */}

      <OrderTable />

    </div>

  );

}


export default DashBorad;