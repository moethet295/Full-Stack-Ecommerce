import { body, param } from "express-validator";

export const registerValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];


export const loginValidator = [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

export const uploadImageValidator = [
    body("image_url").notEmpty().withMessage("image is required"),
];

export const emailUpdateValidator = [
    body("email").isEmail().withMessage("Email is required"),
];

export const nameUpdateValidator = [
    body("name").notEmpty().withMessage("Name is required"),
];

export const passwordUpdateValidator = [
    body("oldPassword").isLength({ min: 6 }).withMessage("Old Password must be at least 6 characters"),
    body("newPassword").isLength({ min: 6 }).withMessage("New Password must be at least 6 characters"),

];

export const passwordResetValidator = [
    body("email").isEmail().withMessage("Email is required"),
];

export const passwordChangeValidator = [
    param("token").notEmpty().withMessage("Token is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New Password must be at least 6 characters"),
];

