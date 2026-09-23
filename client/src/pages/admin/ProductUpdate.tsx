import {
  useNavigate,
  useParams,
} from "react-router-dom";

import ProductForm from "./ProductForm";

import type {
  ProductFormInputs,
} from "@/Schema/Product";

import {
  useGetProductDetailQuery,
  useUpdateProductMutation,
} from "@/store/slices/productApiSlice";

import {
  toast,
} from "@/components/ui/toast";


function ProductUpdate() {

  // =========================================
  // ROUTER
  // =========================================

  const { id } =
    useParams<{ id: string }>();


  const navigate =
    useNavigate();


  // =========================================
  // GET PRODUCT
  // =========================================

  const {
    data: product,
    isLoading,
    isFetching,
    isError,
  } = useGetProductDetailQuery(
    id ?? "",
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );


  // =========================================
  // UPDATE MUTATION
  // =========================================

  const [
    updateProduct,
    {
      isLoading: isUpdating,
    },
  ] = useUpdateProductMutation();


  // =========================================
  // NO ID
  // =========================================

  if (!id) {

    return (

      <div className="p-6 text-red-500">
        Product ID not found
      </div>

    );

  }


  // =========================================
  // LOADING
  // =========================================

  if (
    isLoading ||
    isFetching
  ) {

    return (

      <div
        className="
          flex
          min-h-75
          items-center
          justify-center
        "
      >
        Loading product...
      </div>

    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (isError) {

    return (

      <div className="p-6">

        <p
          className="
            font-medium
            text-red-500
          "
        >
          Failed to load product
        </p>


        <p
          className="
            mt-2
            text-sm
            text-muted-foreground
          "
        >
          Product ID: {id}
        </p>

      </div>

    );

  }


  // =========================================
  // PRODUCT NOT FOUND
  // =========================================

  if (!product) {

    return (

      <div className="p-6 text-red-500">
        Product data not found
      </div>

    );

  }


  // =========================================
  // VALID SIZES
  // =========================================

  const validSizes = [
    "2XL",
    "L",
    "M",
    "S",
    "XL",
    "XXL",
  ] as const;


  type ValidSize =
    (typeof validSizes)[number];


  // =========================================
  // VALID COLORS
  // =========================================

  const validColors = [
    "Beige",
    "Black",
    "Blue",
    "Brown",
    "Charcoal",
    "Cream",
    "Dark Blue",
    "Dark Brown",
    "Green",
    "Grey",
    "Navy",
    "Olive",
    "Pink",
    "Red",
    "White",
  ] as const;


  type ValidColor =
    (typeof validColors)[number];


  // =========================================
  // INITIAL DATA
  // =========================================

  const initialData:
    ProductFormInputs = {

    name:
      product.name ?? "",

    description:
      product.description ?? "",

    price:
      Number(
        product.price ?? 0
      ),

    instock_count:
      Number(
        product.instock_count ?? 0
      ),

    category:
      product.category ?? "",


    // =====================================
    // SIZES
    // =====================================

    sizes:
      (product.sizes ?? [])
        .filter(
          (
            size
          ): size is ValidSize =>

            validSizes.includes(
              size as ValidSize
            )
        ),


    // =====================================
    // COLORS
    // =====================================

    colors:
      (product.colors ?? [])
        .filter(
          (
            color
          ): color is ValidColor =>

            validColors.includes(
              color as ValidColor
            )
        ),


    // =====================================
    // EXISTING IMAGES
    // =====================================

    images:
      (product.images ?? [])
        .map(
          (image) => ({

            url:
              image.url,

            preview:
              image.url,

            public_alt:
              image.public_alt ??
              "Product Image",

          })
        ),


    // =====================================
    // BOOLEAN
    // =====================================

    is_new_arrival:
      Boolean(
        product.is_new_arrival
      ),

    is_feature:
      Boolean(
        product.is_feature
      ),


    // =====================================
    // RATING
    // =====================================

    rating_count:
      Number(
        product.rating_count ?? 0
      ),

  };


  // =========================================
  // UPDATE PRODUCT
  // =========================================

  const onSubmit = async (
    data: ProductFormInputs
  ) => {

    try {

      const formData =
        new FormData();


      // =====================================
      // TEXT
      // =====================================

      formData.append(
        "name",
        data.name
      );


      formData.append(
        "description",
        data.description
      );


      formData.append(
        "category",
        data.category
      );


      // =====================================
      // NUMBERS
      // =====================================

      formData.append(
        "price",
        String(data.price)
      );


      formData.append(
        "instock_count",
        String(
          data.instock_count
        )
      );


      formData.append(
        "rating_count",
        String(
          data.rating_count
        )
      );


      // =====================================
      // BOOLEAN
      // =====================================

      formData.append(
        "is_new_arrival",
        String(
          data.is_new_arrival
        )
      );


      formData.append(
        "is_feature",
        String(
          data.is_feature
        )
      );


      // =====================================
      // SIZES
      // =====================================

      data.sizes.forEach(
        (size) => {

          formData.append(
            "sizes",
            size
          );

        }
      );


      // =====================================
      // COLORS
      // =====================================

      data.colors.forEach(
        (color) => {

          formData.append(
            "colors",
            color
          );

        }
      );


      // =====================================
      // EXISTING IMAGES
      // =====================================

      const existingImages =
        data.images

          .filter(
            (image) =>
              !image.file &&
              Boolean(image.url)
          )

          .map(
            (image) => ({

              url:
                image.url!,

              public_alt:
                image.public_alt ??
                "Product Image",

            })
          );


      formData.append(
        "existingImages",
        JSON.stringify(
          existingImages
        )
      );


      // =====================================
      // NEW IMAGES
      // =====================================

      data.images.forEach(
        (image) => {

          if (image.file) {

            formData.append(
              "images",
              image.file
            );

          }

        }
      );


      // =====================================
      // API UPDATE
      // =====================================

      await updateProduct({
        id,
        formData,
      }).unwrap();


      // =====================================
      // SUCCESS
      // =====================================

      toast.add({

        title:
          "Success",

        description:
          "Product updated successfully",

        type:
          "success",

      });


      // =====================================
      // GO BACK TO PRODUCT MANAGEMENT
      // =====================================

      navigate(
        "/admin/manage-products",
        {
          replace: true,
        }
      );


    } catch (error: any) {

      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );


      toast.add({

        title:
          "Error",

        description:
          error?.data?.message ||
          "Failed to update product",

        type:
          "error",

      });

    }

  };


  // =========================================
  // FORM
  // =========================================

  return (

    <ProductForm

      initialData={
        initialData
      }

      onSubmit={
        onSubmit
      }

      isLoading={
        isUpdating
      }

      mode="update"

    />

  );

}


export default ProductUpdate;