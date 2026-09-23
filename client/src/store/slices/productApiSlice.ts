import type {
  Product,
  ProductMeta,
} from "@/types/product";

import {
  apiSlice,
} from "./api";


interface ProductFilters {
  sizes?: string[];
  colors?: string[];

  minPrice?: string;
  maxPrice?: string;

  sortBy?: string;
  keyword?: string;
  category?: string;
}


// =====================================
// DELETE RESPONSE
// =====================================

interface DeleteProductResponse {
  message: string;
}


export const productApiSlice =
  apiSlice.injectEndpoints({

    endpoints: (builder) => ({

      // =====================================
      // NEW ARRIVALS
      // =====================================

      getNewArrivals:
        builder.query<
          Product[],
          void
        >({

          query: () =>
            "/products/new",

          providesTags: [
            "Product",
          ],

        }),


      // =====================================
      // FEATURED
      // =====================================

      getFeatured:
        builder.query<
          Product[],
          void
        >({

          query: () =>
            "/products/featured",

          providesTags: [
            "Product",
          ],

        }),


      // =====================================
      // PRODUCT DETAIL
      // =====================================

      getProductDetail:
        builder.query<
          Product,
          string
        >({

          query: (id) =>
            `/products/${id}`,

          providesTags: (
            result,
            error,
            id
          ) => [

            {
              type: "Product",
              id,
            },

          ],

        }),


      // =====================================
      // PRODUCTS
      // =====================================

      getProducts:
        builder.query<
          Product[],
          ProductFilters
        >({

          query: ({
            sizes,
            colors,
            minPrice,
            maxPrice,
            sortBy,
            keyword,
            category,
          }) => {

            const params =
              new URLSearchParams();


            if (category) {

              params.set(
                "category",
                category
              );

            }


            if (keyword) {

              params.set(
                "keyword",
                keyword
              );

            }


            if (
              sizes &&
              sizes.length > 0
            ) {

              sizes.forEach(
                (size) => {

                  params.append(
                    "sizes",
                    size
                  );

                }
              );

            }


            if (
              colors &&
              colors.length > 0
            ) {

              colors.forEach(
                (color) => {

                  params.append(
                    "colors",
                    color
                  );

                }
              );

            }


            if (minPrice) {

              params.set(
                "minPrice",
                minPrice
              );

            }


            if (maxPrice) {

              params.set(
                "maxPrice",
                maxPrice
              );

            }


            if (sortBy) {

              params.set(
                "sortBy",
                sortBy
              );

            }


            const queryString =
              params.toString();


            return {

              url: queryString
                ? `/products?${queryString}`
                : "/products",

              method: "GET",

            };

          },

          providesTags: [
            "Product",
          ],

        }),


      // =====================================
      // META
      // =====================================

      getProductsMeta:
        builder.query<
          ProductMeta,
          void
        >({

          query: () =>
            "/filters/meta",

          providesTags: [
            "Product",
          ],

        }),


      // =====================================
      // CREATE PRODUCT
      // =====================================

      createProduct:
        builder.mutation<
          Product,
          FormData
        >({

          query: (formData) => ({

            url:
              "/products",

            method:
              "POST",

            body:
              formData,

          }),

          invalidatesTags: [
            "Product",
          ],

        }),


      // =====================================
      // UPDATE PRODUCT
      // =====================================

      updateProduct:
        builder.mutation<
          Product,
          {
            id: string;
            formData: FormData;
          }
        >({

          query: ({
            id,
            formData,
          }) => ({

            url:
              `/products/${id}`,

            method:
              "PUT",

            body:
              formData,

          }),


          invalidatesTags: (
            result,
            error,
            {
              id,
            }
          ) => [

            {
              type: "Product",
              id,
            },

            "Product",

          ],

        }),


      // =====================================
      // DELETE PRODUCT
      // DELETE /api/products/:id
      // =====================================

      deleteProduct:
        builder.mutation<
          DeleteProductResponse,
          string
        >({

          query: (id) => ({

            url:
              `/products/${id}`,

            method:
              "DELETE",

          }),

          // Delete success ဖြစ်တာနဲ့
          // product queries အားလုံး refresh ဖြစ်မယ်
          invalidatesTags: [
            "Product",
          ],

        }),

    }),

  });


export const {

  useGetNewArrivalsQuery,

  useGetFeaturedQuery,

  useGetProductDetailQuery,

  useGetProductsQuery,

  useGetProductsMetaQuery,

  useCreateProductMutation,

  useUpdateProductMutation,

  useDeleteProductMutation,

} = productApiSlice;