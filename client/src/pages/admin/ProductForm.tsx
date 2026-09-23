import {
  Controller,
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import {
  useEffect,
  useRef,
} from "react";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormInputs,
} from "@/Schema/Product";

import ImageUpload from "./ImageUpload";

import TipTap from "@/component/editor/TipTap";

// =========================================
// PROPS
// =========================================

interface ProductFormProps {
  initialData?: ProductFormInputs;

  onSubmit:
    SubmitHandler<ProductFormInputs>;

  isLoading:
    boolean;

  mode?:
    | "create"
    | "update";
}

// =========================================
// CATEGORIES
// =========================================

const categories = [
  "T-shirts",
  "Hoodies",
  "Shirt",
  "Gym",
  "Shorts",
  "Jeans",
];

// =========================================
// SIZES
// =========================================

const sizes = [
  "2XL",
  "L",
  "M",
  "S",
  "XL",
  "XXL",
] as const;

// =========================================
// COLORS
// =========================================

const colors = [
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

// =========================================
// COMPONENT
// =========================================

function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  mode = "create",
}: ProductFormProps) {

  // =========================================
  // PREVENT REPEATED RESET
  // =========================================

  const hasInitialized =
    useRef(false);

  // =========================================
  // FORM
  // =========================================

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<ProductFormInputs>({

    resolver:
      zodResolver(
        productSchema
      ),

    defaultValues: {

      name:
        "",

      description:
        "",

      price:
        0,

      instock_count:
        0,

      category:
        "",

      sizes:
        [],

      colors:
        [],

      images:
        [],

      is_new_arrival:
        false,

      is_feature:
        false,

      rating_count:
        0,

    },

  });

  // =========================================
  // LOAD UPDATE DATA
  // =========================================

  useEffect(() => {

    if (
      !initialData ||
      hasInitialized.current
    ) {
      return;
    }

    reset(initialData);

    hasInitialized.current =
      true;

  }, [
    initialData,
    reset,
  ]);

  // =========================================
  // SUBMIT
  // =========================================

  const submitHandler:
    SubmitHandler<ProductFormInputs> =
    (data) => {

      console.log(
        "FORM SUBMIT DATA:",
        data
      );

      onSubmit(data);

    };

  // =========================================
  // UI
  // =========================================

  return (

    <form

      onSubmit={
        handleSubmit(
          submitHandler
        )
      }

      className="
        mx-auto
        max-w-3xl
        space-y-6
      "
    >

      {/* =====================================
          TITLE
      ====================================== */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
          "
        >

          {mode === "update"
            ? "Update Product"
            : "Create Product"}

        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
          "
        >

          {mode === "update"
            ? "Edit your product information below."
            : "Add your product information below."}

        </p>

      </div>

      {/* =====================================
          PRODUCT NAME
      ====================================== */}

      <div>

        <label
          className="
            mb-2
            block
            font-medium
          "
        >
          Product Name
        </label>

        <input

          {...register(
            "name"
          )}

          type="text"

          placeholder="
            Enter product name
          "

          className="
            w-full
            rounded-md
            border
            p-3
            outline-none
            focus:ring-2
          "

        />

        {errors.name && (

          <p
            className="
              mt-1
              text-sm
              text-red-500
            "
          >
            {errors.name.message}
          </p>

        )}

      </div>

      {/* =====================================
          DESCRIPTION
      ====================================== */}

      <div>

        <label
          className="
            mb-2
            block
            font-medium
          "
        >
          Description
        </label>

        <div
          className="
            min-h-[150px]
            rounded-md
            border
            border-gray-300
            p-3
          "
        >

          <Controller

            name="description"

            control={
              control
            }

            render={({
              field,
            }) => (

              <TipTap

                value={
                  field.value ??
                  ""
                }

                onChange={
                  field.onChange
                }

              />

            )}

          />

        </div>

        {errors.description && (

          <p
            className="
              mt-1
              text-sm
              text-red-500
            "
          >

            {
              errors
                .description
                .message
            }

          </p>

        )}

      </div>

      {/* =====================================
          PRICE + STOCK
      ====================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
        "
      >

        {/* PRICE */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
            "
          >
            Price
          </label>

          <input

            {...register(
              "price",
              {
                valueAsNumber:
                  true,
              }
            )}

            type="number"

            min="0"

            step="0.01"

            className="
              w-full
              rounded-md
              border
              p-3
            "

          />

          {errors.price && (

            <p
              className="
                mt-1
                text-sm
                text-red-500
              "
            >

              {
                errors
                  .price
                  .message
              }

            </p>

          )}

        </div>

        {/* STOCK */}

        <div>

          <label
            className="
              mb-2
              block
              font-medium
            "
          >
            Stock Count
          </label>

          <input

            {...register(
              "instock_count",
              {
                valueAsNumber:
                  true,
              }
            )}

            type="number"

            min="0"

            className="
              w-full
              rounded-md
              border
              p-3
            "

          />

          {errors.instock_count && (

            <p
              className="
                mt-1
                text-sm
                text-red-500
              "
            >

              {
                errors
                  .instock_count
                  .message
              }

            </p>

          )}

        </div>

      </div>

      {/* =====================================
          IMAGES
      ====================================== */}

      <div>

        <label
          className="
            mb-2
            block
            font-medium
          "
        >
          Product Images
        </label>

        <Controller

          name="images"

          control={
            control
          }

          render={({
            field,
          }) => (

            <ImageUpload

              images={
                field.value ??
                []
              }

              onChange={
                field.onChange
              }

            />

          )}

        />

        {errors.images && (

          <p
            className="
              mt-1
              text-sm
              text-red-500
            "
          >

            {
              errors
                .images
                .message
            }

          </p>

        )}

      </div>

      {/* =====================================
          CATEGORY
      ====================================== */}

      <div>

        <label
          className="
            mb-2
            block
            font-medium
          "
        >
          Category
        </label>

        <select

          {...register(
            "category"
          )}

          className="
            w-full
            rounded-md
            border
            p-3
          "
        >

          <option value="">
            Select Category
          </option>

          {categories.map(
            (category) => (

              <option
                key={
                  category
                }
                value={
                  category
                }
              >
                {category}
              </option>

            )
          )}

        </select>

        {errors.category && (

          <p
            className="
              mt-1
              text-sm
              text-red-500
            "
          >

            {
              errors
                .category
                .message
            }

          </p>

        )}

      </div>

      {/* =====================================
          AVAILABLE SIZES
      ====================================== */}

      <div>

        <label
          className="
            mb-3
            block
            font-medium
          "
        >
          Available Sizes
        </label>

        <Controller

          name="sizes"

          control={
            control
          }

          render={({
            field,
          }) => (

            <div
              className="
                flex
                flex-wrap
                gap-4
              "
            >

              {sizes.map(
                (size) => {

                  const checked =
                    field.value?.includes(
                      size
                    ) ?? false;

                  return (

                    <label

                      key={
                        size
                      }

                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                      "
                    >

                      <input

                        type="checkbox"

                        checked={
                          checked
                        }

                        onChange={(
                          event
                        ) => {

                          const currentSizes =
                            field.value ??
                            [];

                          if (
                            event
                              .target
                              .checked
                          ) {

                            field.onChange([
                              ...currentSizes,
                              size,
                            ]);

                          } else {

                            field.onChange(
                              currentSizes.filter(
                                (
                                  currentSize
                                ) =>
                                  currentSize !==
                                  size
                              )
                            );

                          }

                        }}

                      />

                      <span>
                        {size}
                      </span>

                    </label>

                  );

                }
              )}

            </div>

          )}

        />

        {errors.sizes && (

          <p
            className="
              mt-1
              text-sm
              text-red-500
            "
          >

            {
              errors
                .sizes
                .message
            }

          </p>

        )}

      </div>

      {/* =====================================
          AVAILABLE COLORS
      ====================================== */}

      <div>

        <label
          className="
            mb-3
            block
            font-medium
          "
        >
          Available Colors
        </label>

        <Controller

          name="colors"

          control={
            control
          }

          render={({
            field,
          }) => (

            <div
              className="
                flex
                flex-wrap
                gap-4
              "
            >

              {colors.map(
                (color) => {

                  const checked =
                    field.value?.includes(
                      color
                    ) ?? false;

                  return (

                    <label

                      key={
                        color
                      }

                      className="
                        flex
                        cursor-pointer
                        items-center
                        gap-2
                      "
                    >

                      <input

                        type="checkbox"

                        checked={
                          checked
                        }

                        onChange={(
                          event
                        ) => {

                          const currentColors =
                            field.value ??
                            [];

                          if (
                            event
                              .target
                              .checked
                          ) {

                            field.onChange([
                              ...currentColors,
                              color,
                            ]);

                          } else {

                            field.onChange(
                              currentColors.filter(
                                (
                                  currentColor
                                ) =>
                                  currentColor !==
                                  color
                              )
                            );

                          }

                        }}

                      />

                      <span>
                        {color}
                      </span>

                    </label>

                  );

                }
              )}

            </div>

          )}

        />

        {errors.colors && (

          <p
            className="
              mt-1
              text-sm
              text-red-500
            "
          >

            {
              errors
                .colors
                .message
            }

          </p>

        )}

      </div>

      {/* =====================================
          NEW ARRIVAL + FEATURED
      ====================================== */}

      <div
        className="
          flex
          flex-wrap
          gap-8
        "
      >

        {/* NEW ARRIVAL */}

        <Controller

          name="is_new_arrival"

          control={
            control
          }

          render={({
            field,
          }) => (

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2
              "
            >

              <input

                type="checkbox"

                checked={
                  field.value
                }

                onChange={(
                  event
                ) => {

                  field.onChange(
                    event
                      .target
                      .checked
                  );

                }}

              />

              <span>
                New Arrival
              </span>

            </label>

          )}

        />

        {/* FEATURED */}

        <Controller

          name="is_feature"

          control={
            control
          }

          render={({
            field,
          }) => (

            <label
              className="
                flex
                cursor-pointer
                items-center
                gap-2
              "
            >

              <input

                type="checkbox"

                checked={
                  field.value
                }

                onChange={(
                  event
                ) => {

                  field.onChange(
                    event
                      .target
                      .checked
                  );

                }}

              />

              <span>
                Featured
              </span>

            </label>

          )}

        />

      </div>

      {/* =====================================
          RATING COUNT
      ====================================== */}

      <div>

        <label
          className="
            mb-2
            block
            font-medium
          "
        >
          Rating Count
        </label>

        <input

          {...register(
            "rating_count",
            {
              valueAsNumber:
                true,
            }
          )}

          type="number"

          min="0"

          className="
            w-full
            rounded-md
            border
            p-3
          "

        />

        {errors.rating_count && (

          <p
            className="
              mt-1
              text-sm
              text-red-500
            "
          >

            {
              errors
                .rating_count
                .message
            }

          </p>

        )}

      </div>

      {/* =====================================
          SUBMIT BUTTON
      ====================================== */}

      <button

        type="submit"

        disabled={
          isLoading
        }

        className="
          w-full
          rounded-md
          bg-black
          px-5
          py-3
          font-medium
          text-white
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >

        {
          isLoading
            ? mode === "update"
              ? "Updating Product..."
              : "Creating Product..."
            : mode === "update"
              ? "Update Product"
              : "Create Product"
        }

      </button>

    </form>

  );

}

export default ProductForm;