import { Request, Response } from "express";

import asyncHandler from "../utilities/asyncHandler";
import { Product } from "../models/product";
import { AuthRequest } from "../middlewares/authMiddleware";
import { uploadSingleImage } from "../utilities/cloudinay";


// =====================================================
// CREATE PRODUCT
// POST /api/products
// PRIVATE / ADMIN
// =====================================================

export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const {
      name,
      description,
      category,
    } = req.body;


    // ==============================
    // SIZES
    // ==============================

    const sizes: string[] =
      req.body.sizes
        ? Array.isArray(req.body.sizes)
          ? req.body.sizes.map(String)
          : [String(req.body.sizes)]
        : [];


    // ==============================
    // COLORS
    // ==============================

    const colors: string[] =
      req.body.colors
        ? Array.isArray(req.body.colors)
          ? req.body.colors.map(String)
          : [String(req.body.colors)]
        : [];


    // ==============================
    // NUMBERS
    // ==============================

    const price =
      Number(req.body.price);

    const instock_count =
      Number(req.body.instock_count);

    const rating_count =
      Number(req.body.rating_count);


    // ==============================
    // BOOLEAN
    // ==============================

    const is_new_arrival =
      String(req.body.is_new_arrival) ===
      "true";

    const is_feature =
      String(req.body.is_feature) ===
      "true";


    // ==============================
    // IMAGE FILES
    // ==============================

    const files =
      (req.files as Express.Multer.File[]) ||
      [];


    if (files.length === 0) {

      res.status(400);

      throw new Error(
        "At least one product image is required"
      );

    }


    // ==============================
    // CLOUDINARY UPLOAD
    // ==============================

    const uploadedImages: {
      url: string;
      public_alt: string;
    }[] =
      await Promise.all(

        files.map(
          async (image) => {

            const base64Image =
              `data:${image.mimetype};base64,${image.buffer.toString(
                "base64"
              )}`;


            const uploading =
              await uploadSingleImage(
                base64Image,
                "fashion-king/products"
              );


            return {

              url:
                uploading.image_url,

              public_alt:
                uploading.public_alt ||
                "Product Image",

            };

          }
        )

      );


    // ==============================
    // CREATE
    // ==============================

    const newProduct =
      await Product.create({

        name:
          String(name).trim(),

        description:
          String(description),

        price,

        instock_count,

        category:
          String(category),

        sizes,

        colors,

        images:
          uploadedImages,

        is_new_arrival,

        is_feature,

        rating_count,

        userId:
          req.user!._id,

      });


    res.status(201).json({

      message:
        `Product ${newProduct.name} created successfully`,

      product:
        newProduct,

    });

  }
);


// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// PRIVATE / ADMIN
// =====================================================

export const updateProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const { id } =
      req.params;


    // ==============================
    // FIND PRODUCT
    // ==============================

    const existingProduct =
      await Product.findById(id);


    if (!existingProduct) {

      res.status(404);

      throw new Error(
        "Product not found"
      );

    }


    // =================================================
    // DEBUG
    //
    // Update နှိပ်တဲ့အခါ backend terminal မှာ
    // frontend က ပို့လာတဲ့ data ကို မြင်ရမယ်
    // =================================================

    console.log(
      "\n========== PRODUCT UPDATE BODY =========="
    );

    console.log(
      req.body
    );

    console.log(
      "=========================================\n"
    );


    // =================================================
    // NAME
    // =================================================

    if (
      req.body.name !== undefined
    ) {

      existingProduct.name =
        String(
          req.body.name
        ).trim();

    }


    // =================================================
    // DESCRIPTION
    //
    // TipTap သုံးထားလို့
    // <p>Hello</p> ပုံစံ HTML ဝင်လာနိုင်တယ်
    // ဒါက normal ပါ
    // =================================================

    if (
      req.body.description !== undefined
    ) {

      existingProduct.description =
        String(
          req.body.description
        );

    }


    // =================================================
    // PRICE
    // =================================================

    if (
      req.body.price !== undefined
    ) {

      const newPrice =
        Number(
          req.body.price
        );


      if (
        Number.isNaN(
          newPrice
        )
      ) {

        res.status(400);

        throw new Error(
          "Invalid price"
        );

      }


      existingProduct.price =
        newPrice;

    }


    // =================================================
    // STOCK
    // =================================================

    if (
      req.body.instock_count !==
      undefined
    ) {

      const newStock =
        Number(
          req.body.instock_count
        );


      if (
        Number.isNaN(
          newStock
        )
      ) {

        res.status(400);

        throw new Error(
          "Invalid stock count"
        );

      }


      existingProduct.instock_count =
        newStock;

    }


    // =================================================
    // CATEGORY
    // =================================================

    if (
      req.body.category !== undefined
    ) {

      existingProduct.category =
        String(
          req.body.category
        );

    }


    // =================================================
    // SIZES
    //
    // FormData:
    //
    // sizes=S
    // sizes=M
    // sizes=XL
    //
    // Express:
    //
    // sizes: ["S", "M", "XL"]
    // =================================================

    if (
      req.body.sizes !== undefined
    ) {

      const newSizes: string[] =
        Array.isArray(
          req.body.sizes
        )
          ? req.body.sizes.map(
              (size: unknown) =>
                String(size)
            )
          : [
              String(
                req.body.sizes
              ),
            ];


      existingProduct.sizes =
        newSizes;

    }


    // =================================================
    // COLORS
    //
    // FormData:
    //
    // colors=Black
    // colors=Red
    //
    // Express:
    //
    // colors: ["Black", "Red"]
    // =================================================

    if (
      req.body.colors !== undefined
    ) {

      const newColors: string[] =
        Array.isArray(
          req.body.colors
        )
          ? req.body.colors.map(
              (color: unknown) =>
                String(color)
            )
          : [
              String(
                req.body.colors
              ),
            ];


      existingProduct.colors =
        newColors;

    }


    // =================================================
    // NEW ARRIVAL
    // =================================================

    if (
      req.body.is_new_arrival !==
      undefined
    ) {

      existingProduct.is_new_arrival =
        String(
          req.body.is_new_arrival
        ) === "true";

    }


    // =================================================
    // FEATURED
    // =================================================

    if (
      req.body.is_feature !==
      undefined
    ) {

      existingProduct.is_feature =
        String(
          req.body.is_feature
        ) === "true";

    }


    // =================================================
    // RATING COUNT
    // =================================================

    if (
      req.body.rating_count !==
      undefined
    ) {

      const newRating =
        Number(
          req.body.rating_count
        );


      if (
        Number.isNaN(
          newRating
        )
      ) {

        res.status(400);

        throw new Error(
          "Invalid rating count"
        );

      }


      existingProduct.rating_count =
        newRating;

    }


    // =================================================
    // EXISTING IMAGES
    // =================================================

    let existingImages: {
      url: string;
      public_alt: string;
    }[] = [];


    if (
      req.body.existingImages
    ) {

      try {

        const parsedImages =
          JSON.parse(
            String(
              req.body.existingImages
            )
          );


        if (
          Array.isArray(
            parsedImages
          )
        ) {

          existingImages =
            parsedImages

              .filter(
                (image) =>
                  image &&
                  image.url
              )

              .map(
                (image) => ({

                  url:
                    String(
                      image.url
                    ),

                  public_alt:
                    String(
                      image.public_alt ||
                      "Product Image"
                    ),

                })
              );

        }

      } catch (error) {

        res.status(400);

        throw new Error(
          "Invalid existing images data"
        );

      }

    }


    // =================================================
    // NEW IMAGE FILES
    // =================================================

    const newFiles =
      (req.files as Express.Multer.File[]) ||
      [];


    // =================================================
    // UPLOAD NEW IMAGES
    // =================================================

    const uploadedImages: {
      url: string;
      public_alt: string;
    }[] =
      await Promise.all(

        newFiles.map(
          async (image) => {

            const base64Image =
              `data:${image.mimetype};base64,${image.buffer.toString(
                "base64"
              )}`;


            const uploading =
              await uploadSingleImage(
                base64Image,
                "fashion-king/products"
              );


            return {

              url:
                uploading.image_url,

              public_alt:
                uploading.public_alt ||
                "Product Image",

            };

          }
        )

      );


    // =================================================
    // MERGE IMAGES
    // =================================================

    const finalImages: {
      url: string;
      public_alt: string;
    }[] = [

      ...existingImages,

      ...uploadedImages,

    ];


    // =================================================
    // REQUIRE IMAGE
    // =================================================

    if (
      finalImages.length === 0
    ) {

      res.status(400);

      throw new Error(
        "At least one product image is required"
      );

    }


    existingProduct.images =
      finalImages;


    // =================================================
    // DEBUG BEFORE SAVE
    // =================================================

    console.log(
      "\n========== BEFORE SAVE =========="
    );

    console.log({
      name:
        existingProduct.name,

      description:
        existingProduct.description,

      price:
        existingProduct.price,

      instock_count:
        existingProduct.instock_count,

      category:
        existingProduct.category,

      sizes:
        existingProduct.sizes,

      colors:
        existingProduct.colors,

      is_new_arrival:
        existingProduct.is_new_arrival,

      is_feature:
        existingProduct.is_feature,

      rating_count:
        existingProduct.rating_count,
    });

    console.log(
      "=================================\n"
    );


    // =================================================
    // SAVE
    // =================================================

    const updatedProduct =
      await existingProduct.save();


    // =================================================
    // RESPONSE
    // =================================================

    res.status(200).json({

      message:
        "Product updated successfully",

      product:
        updatedProduct,

    });

  }
);


// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// PRIVATE / ADMIN
// =====================================================

export const deleteProduct = asyncHandler(
  async (req: AuthRequest, res: Response) => {

    const { id } =
      req.params;


    const existingProduct =
      await Product.findById(id);


    if (!existingProduct) {

      res.status(404);

      throw new Error(
        "Product not found"
      );

    }


    await existingProduct.deleteOne();


    res.status(200).json({

      message:
        "Product deleted successfully",

    });

  }
);


// =====================================================
// GET PRODUCTS WITH FILTER
// GET /api/products
// PUBLIC
// =====================================================

export const productwithFilter =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {

        keyword,

        category,

        minPrice,

        maxPrice,

        sizes,

        colors,

        sortBy,

      } = req.query;


      const query: any = {};


      // ==============================
      // KEYWORD
      // ==============================

      if (
        typeof keyword ===
          "string" &&
        keyword.trim()
      ) {

        query.name = {

          $regex:
            keyword.trim(),

          $options:
            "i",

        };

      }


      // ==============================
      // CATEGORY
      // ==============================

      if (
        typeof category ===
          "string" &&
        category.trim()
      ) {

        query.category = {

          $regex:
            `^${category.trim()}$`,

          $options:
            "i",

        };

      }


      // ==============================
      // PRICE
      // ==============================

      if (
        minPrice ||
        maxPrice
      ) {

        query.price = {};


        if (
          typeof minPrice ===
            "string" &&
          minPrice !== ""
        ) {

          const min =
            Number(
              minPrice
            );


          if (
            !Number.isNaN(
              min
            )
          ) {

            query.price.$gte =
              min;

          }

        }


        if (
          typeof maxPrice ===
            "string" &&
          maxPrice !== ""
        ) {

          const max =
            Number(
              maxPrice
            );


          if (
            !Number.isNaN(
              max
            )
          ) {

            query.price.$lte =
              max;

          }

        }

      }


      // ==============================
      // SIZES
      // ==============================

      if (sizes) {

        const sizeArray =
          Array.isArray(
            sizes
          )
            ? sizes
            : [sizes];


        const validSizes =
          sizeArray

            .filter(
              (
                size
              ): size is string =>
                typeof size ===
                "string"
            )

            .map(
              (size) =>
                new RegExp(
                  `^${size}$`,
                  "i"
                )
            );


        if (
          validSizes.length > 0
        ) {

          query.sizes = {

            $in:
              validSizes,

          };

        }

      }


      // ==============================
      // COLORS
      // ==============================

      if (colors) {

        const colorArray =
          Array.isArray(
            colors
          )
            ? colors
            : [colors];


        const validColors =
          colorArray

            .filter(
              (
                color
              ): color is string =>
                typeof color ===
                "string"
            )

            .map(
              (color) =>
                new RegExp(
                  `^${color}$`,
                  "i"
                )
            );


        if (
          validColors.length > 0
        ) {

          query.colors = {

            $in:
              validColors,

          };

        }

      }


      // ==============================
      // SORT
      // ==============================

      const sortOption: any =
        {};


      if (
        sortBy ===
        "price-asc"
      ) {

        sortOption.price =
          1;

      } else if (
        sortBy ===
        "price-desc"
      ) {

        sortOption.price =
          -1;

      } else if (
        sortBy ===
        "newest"
      ) {

        sortOption.createdAt =
          -1;

      } else if (
        sortBy ===
        "rating"
      ) {

        sortOption.rating_count =
          -1;

      }


      // ==============================
      // FIND
      // ==============================

      const products =
        await Product
          .find(query)
          .sort(sortOption);


      res.status(200).json(
        products
      );

    }
  );


// =====================================================
// GET NEW ARRIVALS
// GET /api/products/new
// PUBLIC
// =====================================================

export const getNewProduct =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const products =
        await Product
          .find({

            is_new_arrival:
              true,

          })
          .sort({

            createdAt:
              -1,

          });


      res.status(200).json(
        products
      );

    }
  );


// =====================================================
// GET FEATURED PRODUCTS
// GET /api/products/featured
// PUBLIC
// =====================================================

export const getFeaturedProducts =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const products =
        await Product
          .find({

            is_feature:
              true,

          })
          .sort({

            createdAt:
              -1,

          });


      res.status(200).json(
        products
      );

    }
  );


// =====================================================
// GET PRODUCT BY ID
// GET /api/products/:id
// PUBLIC
// =====================================================

export const getNewProductById =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const { id } =
        req.params;


      const product =
        await Product.findById(
          id
        );


      if (!product) {

        res.status(404);

        throw new Error(
          "Product not found"
        );

      }


      res.status(200).json(
        product
      );

    }
  );


// =====================================================
// GET PRODUCT META
// GET /api/filters/meta
// PUBLIC
// =====================================================

export const getProductsMeta =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      // ==============================
      // COLORS
      // ==============================

      const colors =
        await Product.distinct(
          "colors"
        );


      // ==============================
      // SIZES
      // ==============================

      const sizes =
        await Product.distinct(
          "sizes"
        );


      // ==============================
      // PRICE RANGE
      // ==============================

      const priceRange =
        await Product.aggregate([
          {

            $group: {

              _id:
                null,

              minPrice: {

                $min:
                  "$price",

              },

              maxPrice: {

                $max:
                  "$price",

              },

            },

          },
        ]);


      // ==============================
      // RESPONSE
      // ==============================

      res.status(200).json({

        colors,

        sizes,

        minPrice:
          priceRange[0]
            ?.minPrice ??
          0,

        maxPrice:
          priceRange[0]
            ?.maxPrice ??
          0,

      });

    }
  );