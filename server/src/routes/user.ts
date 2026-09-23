import {
  Router,
} from "express";

import {
  getUserInfo,
  registerUser,
  loginUser,
  logoutUser,
  sendforgotEmailPassword,
  updateEmailAddress,
  updateName,
  updatePassword,
  uploadAvator,
  resetPassword,

  // ADMIN
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/user";

import {
  protect,
  isAdmin,
} from "../middlewares/authMiddleware";

import {
  registerValidator,
  loginValidator,
  uploadImageValidator,
  emailUpdateValidator,
  nameUpdateValidator,
  passwordUpdateValidator,
  passwordResetValidator,
  passwordChangeValidator,
} from "../validators/user";

import {
  validateRequest,
} from "../middlewares/validateRequest";

const router =
  Router();

// =====================================
// REGISTER
// =====================================

router.post(
  "/register",
  registerValidator,
  validateRequest,
  registerUser
);

// =====================================
// LOGIN
// =====================================

router.post(
  "/login",
  loginValidator,
  validateRequest,
  loginUser
);

// =====================================
// LOGOUT
// =====================================

router.post(
  "/logout",
  logoutUser
);

// =====================================
// AVATAR
// =====================================

router.post(
  "/upload",
  uploadImageValidator,
  validateRequest,
  protect,
  uploadAvator
);

// =====================================
// CURRENT USER
// =====================================

router.get(
  "/me",
  protect,
  getUserInfo
);

// =====================================
// UPDATE EMAIL
// =====================================

router.post(
  "/update-email",
  emailUpdateValidator,
  validateRequest,
  protect,
  updateEmailAddress
);

// =====================================
// UPDATE NAME
// =====================================

router.post(
  "/update-name",
  nameUpdateValidator,
  validateRequest,
  protect,
  updateName
);

// =====================================
// UPDATE PASSWORD
// =====================================

router.post(
  "/update-password",
  passwordUpdateValidator,
  validateRequest,
  protect,
  updatePassword
);

// =====================================
// FORGOT PASSWORD
// =====================================

router.post(
  "/forgot-password",
  passwordResetValidator,
  validateRequest,
  sendforgotEmailPassword
);

// =====================================
// RESET PASSWORD
// =====================================

router.post(
  "/reset-password/:token",
  passwordChangeValidator,
  validateRequest,
  resetPassword
);

// =====================================
// ADMIN - GET ALL USERS
// =====================================

router.get(
  "/users/admin/all",
  protect,
  isAdmin,
  getAllUsers
);

// =====================================
// ADMIN - UPDATE ROLE
// =====================================

router.patch(
  "/users/:id/role",
  protect,
  isAdmin,
  updateUserRole
);

// =====================================
// ADMIN - DELETE / KICK USER
// =====================================

router.delete(
  "/users/:id",
  protect,
  isAdmin,
  deleteUser
);

export default router;