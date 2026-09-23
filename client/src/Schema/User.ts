import { z } from "zod";

export const emailUpdateSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});


export const nameUpdateSchema = z.object({
    name: z.string().min(3, {message: "Username must have 3 character"}),
});

export const passwordUpdateSchema = z.object({
    oldPassword: z.string().min(6, {
      message: "Password must have at least 6 characters",
    }),

    newPassword: z.string().min(6, {
      message: "Password must have at least 6 characters",
    }),

    confirmPassword: z.string().min(1, {
      message: "Please enter password again",
    }),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );