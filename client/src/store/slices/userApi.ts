import {
  apiSlice,
} from "./api";

import type {
  User,
} from "@/types/user";

// =====================================
// INPUT TYPES
// =====================================

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput
  extends LoginInput {
  name: string;
}

interface AvatarUploadInput {
  image_url: string;
}

interface EmailUpdateInput {
  email: string;
}

interface NameUpdateInput {
  name: string;
}

interface PasswordUpdateInputs {
  oldPassword: string;
  newPassword: string;
}

interface ResetPasswordInputs {
  token: string;
  newPassword: string;
}

interface ForgotPasswordInput {
  email: string;
}

// =====================================
// ADMIN USER TYPE
// =====================================

export interface AdminUser {
  _id: string;

  name: string;

  email: string;

  role:
    | "customer"
    | "admin";

  avator?: {
    url?: string;
    public_id?: string;
    public_alt?: string;
  };

  createdAt?: string;

  updatedAt?: string;
}

// =====================================
// ROLE UPDATE
// =====================================

interface UpdateUserRoleInput {
  id: string;

  role:
    | "customer"
    | "admin";
}

interface UpdateUserRoleResponse {
  message: string;

  user: AdminUser;
}

// =====================================
// DELETE RESPONSE
// =====================================

interface DeleteUserResponse {
  message: string;
}

// =====================================
// API
// =====================================

export const userApiSlice =
  apiSlice.injectEndpoints({

    endpoints:
      (builder) => ({

        // ===============================
        // REGISTER
        // ===============================

        register:
          builder.mutation<
            User,
            RegisterInput
          >({

            query:
              (data) => ({
                url:
                  "/register",

                method:
                  "POST",

                body:
                  data,
              }),

            invalidatesTags: [
              "User",
            ],
          }),

        // ===============================
        // LOGIN
        // ===============================

        login:
          builder.mutation<
            User,
            LoginInput
          >({

            query:
              (data) => ({
                url:
                  "/login",

                method:
                  "POST",

                body:
                  data,

                credentials:
                  "include",
              }),
          }),

        // ===============================
        // LOGOUT
        // ===============================

        logout:
          builder.mutation<
            void,
            void
          >({

            query:
              () => ({
                url:
                  "/logout",

                method:
                  "POST",

                credentials:
                  "include",
              }),
          }),

        // ===============================
        // CURRENT USER
        // ===============================

        currentUser:
          builder.query<
            User,
            void
          >({

            query:
              () => ({
                url:
                  "/me",

                method:
                  "GET",

                credentials:
                  "include",
              }),

            providesTags: [
              "User",
            ],
          }),

        // ===============================
        // UPLOAD AVATAR
        // ===============================

        uploadAvatar:
          builder.mutation<
            unknown,
            AvatarUploadInput
          >({

            query:
              (data) => ({
                url:
                  "/upload",

                method:
                  "POST",

                body:
                  data,

                credentials:
                  "include",
              }),

            invalidatesTags: [
              "User",
            ],
          }),

        // ===============================
        // UPDATE EMAIL
        // ===============================

        EmailUpdate:
          builder.mutation<
            unknown,
            EmailUpdateInput
          >({

            query:
              (data) => ({
                url:
                  "/update-email",

                method:
                  "POST",

                body:
                  data,

                credentials:
                  "include",
              }),

            invalidatesTags: [
              "User",
            ],
          }),

        // ===============================
        // UPDATE NAME
        // ===============================

        NameUpdate:
          builder.mutation<
            unknown,
            NameUpdateInput
          >({

            query:
              (data) => ({
                url:
                  "/update-name",

                method:
                  "POST",

                body:
                  data,

                credentials:
                  "include",
              }),

            invalidatesTags: [
              "User",
            ],
          }),

        // ===============================
        // UPDATE PASSWORD
        // ===============================

        PasswordUpdate:
          builder.mutation<
            unknown,
            PasswordUpdateInputs
          >({

            query:
              (data) => ({
                url:
                  "/update-password",

                method:
                  "POST",

                body:
                  data,

                credentials:
                  "include",
              }),

            invalidatesTags: [
              "User",
            ],
          }),

        // ===============================
        // FORGOT PASSWORD
        // ===============================

        ForgotPassword:
          builder.mutation<
            unknown,
            ForgotPasswordInput
          >({

            query:
              (data) => ({
                url:
                  "/forgot-password",

                method:
                  "POST",

                body:
                  data,

                credentials:
                  "include",
              }),
          }),

        // ===============================
        // RESET PASSWORD
        // ===============================

        ResetPassword:
          builder.mutation<
            unknown,
            ResetPasswordInputs
          >({

            query:
              (data) => ({
                url:
                  `/reset-password/${data.token}`,

                method:
                  "POST",

                body: {
                  newPassword:
                    data.newPassword,
                },
              }),
          }),

        // ===============================
        // ADMIN - GET ALL USERS
        // ===============================

        getAllUsers:
          builder.query<
            AdminUser[],
            void
          >({

            query:
              () => ({
                url:
                  "/users/admin/all",

                method:
                  "GET",

                credentials:
                  "include",
              }),

            providesTags: [
              "User",
            ],
          }),

        // ===============================
        // ADMIN - UPDATE ROLE
        // ===============================

        updateUserRole:
          builder.mutation<
            UpdateUserRoleResponse,
            UpdateUserRoleInput
          >({

            query:
              ({
                id,
                role,
              }) => ({

                url:
                  `/users/${id}/role`,

                method:
                  "PATCH",

                body: {
                  role,
                },

                credentials:
                  "include",
              }),

            invalidatesTags: [
              "User",
            ],
          }),

        // ===============================
        // ADMIN - DELETE USER
        // ===============================

        deleteUser:
          builder.mutation<
            DeleteUserResponse,
            string
          >({

            query:
              (id) => ({
                url:
                  `/users/${id}`,

                method:
                  "DELETE",

                credentials:
                  "include",
              }),

            invalidatesTags: [
              "User",
            ],
          }),
      }),

    overrideExisting:
      false,
  });

// =====================================
// EXPORT HOOKS
// =====================================

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useCurrentUserQuery,
  useUploadAvatarMutation,
  useEmailUpdateMutation,
  useNameUpdateMutation,
  usePasswordUpdateMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,

  // ADMIN
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApiSlice;