import {
  ImagePlus,
  X,
} from "lucide-react";

import type {
  ChangeEvent,
} from "react";


interface ProductImage {
  file?: File;

  preview: string;

  url?: string;

  public_alt?: string;
}


interface ImageUploadProps {
  images: ProductImage[];

  onChange:
    (images: ProductImage[]) =>
      void;
}


function ImageUpload({
  images = [],
  onChange,
}: ImageUploadProps) {

  const handleImageChange = (
    event:
      ChangeEvent<HTMLInputElement>
  ) => {

    const files =
      event.target.files;

    if (!files) return;


    const newImages:
      ProductImage[] =
      Array.from(files).map(
        (file) => ({
          file,

          preview:
            URL.createObjectURL(
              file
            ),

          public_alt:
            file.name,
        })
      );


    onChange([
      ...images,
      ...newImages,
    ]);


    event.target.value = "";
  };


  const handleRemoveImage = (
    index: number
  ) => {

    const image =
      images[index];


    if (
      image?.preview?.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        image.preview
      );
    }


    const updatedImages =
      images.filter(
        (_, i) =>
          i !== index
      );


    onChange(
      updatedImages
    );
  };


  return (
    <div className="space-y-4">

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition hover:bg-gray-50">

        <ImagePlus
          size={35}
          className="mb-2"
        />

        <span className="font-medium">
          Upload Product Images
        </span>

        <span className="mt-1 text-sm text-gray-500">
          PNG, JPG, WEBP or GIF
        </span>


        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={
            handleImageChange
          }
          className="hidden"
        />

      </label>


      {images.length > 0 && (

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

          {images.map(
            (image, index) => (

              <div
                key={index}
                className="relative overflow-hidden rounded-lg border"
              >

                <img
                  src={
                    image.preview ||
                    image.url
                  }
                  alt={
                    image.public_alt ||
                    "Product"
                  }
                  className="h-32 w-full object-cover"
                />


                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(
                      index
                    )
                  }
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-white"
                >
                  <X size={16} />
                </button>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}


export default ImageUpload;