import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt, {
  JwtPayload,
} from "jsonwebtoken";

import {
  Types,
} from "mongoose";

import {
  User,
} from "../models/user";

import asyncHandler from "../utilities/asyncHandler";

interface AuthUser {
  name: string;
  email: string;
  _id: string | Types.ObjectId;
  role: "customer" | "admin";
}

export interface AuthRequest
  extends Request {
  user?: AuthUser;
}

// =====================================
// PROTECT
// =====================================

export const protect =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {

      // =================================
      // GET TOKEN FROM COOKIE
      // =================================

      const token =
        req.cookies?.token;

      console.log(
        "TOKEN EXISTS =>",
        !!token
      );

      // =================================
      // NO TOKEN
      // =================================

      if (!token) {
        res.status(401);

        throw new Error(
          "Not authorized, no token"
        );
      }

      try {

        // =================================
        // VERIFY TOKEN
        // =================================

        const decoded =
          jwt.verify(
            token,
            process.env
              .JSON_WEB_TOKEN_SECRET!
          ) as JwtPayload;

        // =================================
        // CHECK TOKEN ID
        // =================================

        if (!decoded.id) {
          res.status(401);

          throw new Error(
            "Not authorized, invalid token"
          );
        }

        // =================================
        // FIND USER
        // =================================

        const user =
          await User
            .findById(
              decoded.id
            )
            .select(
              "-password"
            );

        if (!user) {
          res.status(401);

          throw new Error(
            "Not authorized, user not found"
          );
        }

        // =================================
        // SET USER
        // =================================

        req.user = {
          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,
        };

        next();

      } catch (error) {

        // Error ကို အပေါ်မှာ
        // status သတ်မှတ်ထားပြီးသားဆို
        // ထပ်မပြောင်းပါ

        if (
          res.statusCode === 200
        ) {
          res.status(401);
        }

        throw new Error(
          "Not authorized, token failed"
        );
      }
    }
  );

// =====================================
// ADMIN ONLY
// =====================================

export const isAdmin =
  asyncHandler(
    async (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {

      if (
        !req.user
      ) {
        res.status(401);

        throw new Error(
          "Not authorized"
        );
      }

      if (
        req.user.role !==
        "admin"
      ) {
        res.status(403);

        throw new Error(
          "Not authorized, admin access required"
        );
      }

      next();
    }
  );