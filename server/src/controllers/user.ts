import {
  Request,
  Response,
} from "express";

import { User } from "../models/user";

import asyncHandler from "../utilities/asyncHandler";

import generateToken from "../utilities/generateToken";

import {
  AuthRequest,
} from "../middlewares/authMiddleware";

import {
  uploadSingleImage,
} from "../utilities/cloudinay";

import bcrypt from "bcryptjs";

import {
  forgetPasswordEmailTemplate,
} from "../utilities/emailTemplate";

import {
  sendEmail,
} from "../utilities/sendEmail";

import crypto from "crypto";

import mongoose from "mongoose";

// =====================================
// REGISTER USER
// =====================================

export const registerUser =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        name,
        email,
        password,
      } = req.body;

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        res.status(400);

        throw new Error(
          "User already exists"
        );
      }

      const newUser =
        await User.create({
          name,
          email,
          password,
        });

      generateToken(
        res,
        newUser._id
      );

      res.status(201).json({
        _id:
          newUser._id,

        name:
          newUser.name,

        email:
          newUser.email,

        role:
          newUser.role,
      });
    }
  );

// =====================================
// LOGIN USER
// =====================================

export const loginUser =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        email,
        password,
      } = req.body;

      const existingUser =
        await User.findOne({
          email,
        });

      if (
        existingUser &&
        await existingUser
          .matchPassword(
            password
          )
      ) {

        generateToken(
          res,
          existingUser._id
        );

        res.status(200).json({
          _id:
            existingUser._id
              .toString(),

          name:
            existingUser.name,

          email:
            existingUser.email,

          role:
            existingUser.role,

          avator:
            existingUser.avator,
        });

        return;
      }

      res.status(401);

      throw new Error(
        "Invalid email or password"
      );
    }
  );

// =====================================
// LOGOUT
// =====================================

export const logoutUser =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      res.cookie(
        "token",
        "",
        {
          httpOnly:
            true,

          maxAge:
            new Date(0)
              .getTime(),
        }
      );

      res.status(200).json({
        message:
          "Logged out successfully",
      });
    }
  );

// =====================================
// UPLOAD AVATAR
// =====================================

export const uploadAvator =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        user,
      } = req;

      const {
        image_url,
      } = req.body;

      if (!user) {
        res.status(401);

        throw new Error(
          "User not authenticated"
        );
      }

      if (!image_url) {
        res.status(400);

        throw new Error(
          "Image is required"
        );
      }

      const response =
        await uploadSingleImage(
          image_url,
          "FASHION KING/avatar"
        );

      await User.findByIdAndUpdate(
        user._id,
        {
          avator: {
            url:
              response.image_url,

            public_alt:
              response.public_alt,
          },
        },
        {
          new:
            true,
        }
      );

      res.status(200).json({
        message:
          "Avator Uploaded",

        avator: {
          url:
            response.image_url,

          public_alt:
            response.public_alt,
        },
      });
    }
  );

// =====================================
// CURRENT USER
// =====================================

export const getUserInfo =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const userDoc =
        await User
          .findById(
            req.user?._id
          )
          .select(
            "-password"
          );

      res.status(200).json(
        userDoc
      );
    }
  );

// =====================================
// UPDATE EMAIL
// =====================================

export const updateEmailAddress =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        email,
      } = req.body;

      const existingEmailUser =
        await User.findOne({
          email,
        });

      if (
        existingEmailUser &&
        existingEmailUser._id
          .toString() !==
          req.user?._id
            .toString()
      ) {

        res.status(400);

        throw new Error(
          "Email is already owned by other user"
        );
      }

      await User.findByIdAndUpdate(
        req.user?._id,
        {
          email,
        }
      );

      res.status(200).json({
        message:
          "User email updated",
      });
    }
  );

// =====================================
// UPDATE NAME
// =====================================

export const updateName =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        name,
      } = req.body;

      await User.findByIdAndUpdate(
        req.user?._id,
        {
          name,
        }
      );

      res.status(200).json({
        message:
          "Profile name updated",
      });
    }
  );

// =====================================
// UPDATE PASSWORD
// =====================================

export const updatePassword =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        oldPassword,
        newPassword,
      } = req.body;

      const existingUser =
        await User
          .findById(
            req.user?._id
          )
          .select(
            "+password"
          );

      if (!existingUser) {
        res.status(404);

        throw new Error(
          "User not found"
        );
      }

      const isPasswordMatch =
        await bcrypt.compare(
          oldPassword,
          existingUser.password
        );

      if (!isPasswordMatch) {
        res.status(400);

        throw new Error(
          "Old password is wrong"
        );
      }

      existingUser.password =
        newPassword;

      await existingUser.save();

      res.status(200).json({
        message:
          "Password updated",
      });
    }
  );

// =====================================
// FORGOT PASSWORD
// =====================================

export const sendforgotEmailPassword =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const {
        email,
      } = req.body;

      const existinguser =
        await User.findOne({
          email,
        });

      if (!existinguser) {
        res.status(404);

        throw new Error(
          "User not found"
        );
      }

      const token =
        existinguser
          .generatePasswordResetToken();

      await existinguser.save();

      const resetPasswordUrl =
        `${process.env.CLIENT_URL}/reset-password/${token}`;

      const body =
        forgetPasswordEmailTemplate(
          resetPasswordUrl
        );

      try {

        await sendEmail({
          reciver_mail:
            existinguser.email,

          subject:
            "Password Reset - FASHIONKING",

          body,
        });

      } catch {

        existinguser.set(
          "resetPasswordToken",
          undefined
        );

        existinguser.set(
          "resetPasswordExpire",
          undefined
        );

        await existinguser.save();

        res.status(500);

        throw new Error(
          "Failed to send reset email"
        );
      }

      res.status(200).json({
        message:
          "Email sent successfully",
      });
    }
  );

// =====================================
// RESET PASSWORD
// =====================================

export const resetPassword =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        token,
      } = req.params;

      const {
        newPassword,
      } = req.body;

      if (
        typeof token !==
        "string"
      ) {

        res.status(400);

        throw new Error(
          "Invalid reset token"
        );
      }

      const hashedToken =
        crypto
          .createHash(
            "sha256"
          )
          .update(
            token
          )
          .digest(
            "hex"
          );

      const user =
        await User.findOne({
          resetPasswordToken:
            hashedToken,

          resetPasswordExpire: {
            $gt:
              new Date(),
          },
        });

      if (!user) {
        res.status(400);

        throw new Error(
          "Token is invalid or expired"
        );
      }

      user.password =
        newPassword;

      user.set(
        "resetPasswordToken",
        undefined
      );

      user.set(
        "resetPasswordExpire",
        undefined
      );

      await user.save();

      res.status(200).json({
        message:
          "Password reset successfully",
      });
    }
  );

// =====================================
// ADMIN - GET ALL USERS
// =====================================

export const getAllUsers =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const users =
        await User
          .find()
          .select(
            "-password -resetPasswordToken -resetPasswordExpire"
          )
          .sort({
            createdAt:
              -1,
          });

      res.status(200).json(
        users
      );
    }
  );

// =====================================
// ADMIN - UPDATE USER ROLE
// =====================================

export const updateUserRole =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        id,
      } = req.params;

      const {
        role,
      }: {
        role?:
          | "customer"
          | "admin";
      } = req.body;

      // =================================
      // VALID ID
      // =================================

      if (
        typeof id !==
          "string" ||
        !mongoose.Types
          .ObjectId
          .isValid(id)
      ) {

        res.status(400);

        throw new Error(
          "Invalid user ID"
        );
      }

      // =================================
      // VALID ROLE
      // =================================

      if (
        role !== "customer" &&
        role !== "admin"
      ) {

        res.status(400);

        throw new Error(
          "Invalid user role"
        );
      }

      // =================================
      // DON'T CHANGE YOUR OWN ROLE
      // =================================

      if (
        req.user?._id
          .toString() === id
      ) {

        res.status(400);

        throw new Error(
          "You cannot change your own admin role"
        );
      }

      // =================================
      // FIND USER
      // =================================

      const user =
        await User.findById(
          id
        );

      if (!user) {
        res.status(404);

        throw new Error(
          "User not found"
        );
      }

      // =================================
      // UPDATE
      // =================================

      user.role =
        role;

      await user.save();

      res.status(200).json({
        message:
          role === "admin"
            ? "Admin role granted successfully"
            : "Admin role removed successfully",

        user: {
          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          avator:
            user.avator,
        },
      });
    }
  );

// =====================================
// ADMIN - DELETE / KICK USER
// =====================================

export const deleteUser =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response
    ) => {

      const {
        id,
      } = req.params;

      // =================================
      // VALID ID
      // =================================

      if (
        typeof id !==
          "string" ||
        !mongoose.Types
          .ObjectId
          .isValid(id)
      ) {

        res.status(400);

        throw new Error(
          "Invalid user ID"
        );
      }

      // =================================
      // DON'T DELETE YOURSELF
      // =================================

      if (
        req.user?._id
          .toString() === id
      ) {

        res.status(400);

        throw new Error(
          "You cannot delete your own account from User Management"
        );
      }

      // =================================
      // FIND USER
      // =================================

      const user =
        await User.findById(
          id
        );

      if (!user) {
        res.status(404);

        throw new Error(
          "User not found"
        );
      }

      // =================================
      // DELETE USER
      // =================================

      await user.deleteOne();

      res.status(200).json({
        message:
          "User removed successfully",
      });
    }
  );