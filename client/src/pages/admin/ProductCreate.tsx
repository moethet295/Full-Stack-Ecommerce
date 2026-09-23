import type { ProductFormInputs } from "@/Schema/Product";
import ProductForm from "./ProductForm";
import { useCreateProductMutation } from "@/store/slices/productApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/toast";

function ProductCreate() {
  const [createProduct, { isLoading }] =
    useCreateProductMutation();

  const navigate = useNavigate();

  const onSubmit = async (
    data: ProductFormInputs
  ) => {
    try {
      const formData = new FormData();

      // ==============================
      // BASIC DATA
      // ==============================

      formData.append(
        "name",
        data.name
      );

      formData.append(
        "description",
        data.description
      );

      formData.append(
        "price",
        String(data.price)
      );

      formData.append(
        "instock_count",
        String(data.instock_count)
      );

      formData.append(
        "category",
        data.category
      );

      formData.append(
        "is_feature",
        String(data.is_feature)
      );

      formData.append(
        "is_new_arrival",
        String(data.is_new_arrival)
      );

      formData.append(
        "rating_count",
        String(data.rating_count)
      );


      // ==============================
      // COLORS
      // ==============================

      data.colors.forEach((color) => {
        formData.append(
          "colors",
          color
        );
      });


      // ==============================
      // SIZES
      // ==============================

      data.sizes.forEach((size) => {
        formData.append(
          "sizes",
          size
        );
      });


      // ==============================
      // IMAGES
      // ==============================

      data.images.forEach((image) => {
        if (image.file) {
          formData.append(
            "images",
            image.file
          );
        }
      });


      // ==============================
      // CREATE PRODUCT
      // ==============================

      await createProduct(
        formData
      ).unwrap();


      toast.add({
        title: "Success",
        description:
          "Product created successfully",
        type: "success",
      });


      navigate(
        "/admin/products"
      );

    } catch (error: any) {

      console.error(
        "CREATE PRODUCT ERROR:",
        error
      );

      toast.add({
        title: "Error",
        description:
          error?.data?.message ||
          "Failed to create product",
        type: "error",
      });
    }
  };


  return (
    <ProductForm
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  );
}

export default ProductCreate;