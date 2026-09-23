import { Router } from "express";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  productwithFilter,
  getNewProduct,
  getFeaturedProducts,
  getNewProductById,
  getProductsMeta,
} from "../controllers/product";

import {
  isAdmin,
  protect,
} from "../middlewares/authMiddleware";

import { upload } from "../utilities/upload";

const router = Router();


// =========================================
// CREATE PRODUCT
// POST /api/products
// PRIVATE / ADMIN
// =========================================
router.post(
  "/products",
  protect,
  isAdmin,
  upload.array("images"),
  createProduct
);


// =========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// PRIVATE / ADMIN
// =========================================
router.put(
  "/products/:id",
  protect,
  isAdmin,
  upload.array("images"),
  updateProduct
);


// =========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// PRIVATE / ADMIN
// =========================================
router.delete(
  "/products/:id",
  protect,
  isAdmin,
  deleteProduct
);


// =========================================
// GET PRODUCTS
// GET /api/products
// PUBLIC
// =========================================
router.get(
  "/products",
  productwithFilter
);


// =========================================
// GET NEW ARRIVALS
// GET /api/products/new
// PUBLIC
// =========================================
router.get(
  "/products/new",
  getNewProduct
);


// =========================================
// GET FEATURED
// GET /api/products/featured
// PUBLIC
// =========================================
router.get(
  "/products/featured",
  getFeaturedProducts
);


// =========================================
// GET PRODUCT META
// GET /api/filters/meta
// PUBLIC
// =========================================
router.get(
  "/filters/meta",
  getProductsMeta
);


// =========================================
// GET PRODUCT BY ID
// GET /api/products/:id
// PUBLIC
// =========================================
router.get(
  "/products/:id",
  getNewProductById
);


export default router;