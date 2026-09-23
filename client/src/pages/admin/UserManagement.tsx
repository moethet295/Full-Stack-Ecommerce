import {
  Shield,
  ShieldOff,
  Trash2,
  Users,
  Loader2,
  Search,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useCurrentUserQuery,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  type AdminUser,
} from "@/store/slices/userApi";

// =====================================
// ERROR TYPE
// =====================================

interface ApiError {
  data?: {
    message?: string;
  };
}

// =====================================
// USER MANAGEMENT
// =====================================

function UserManagement() {

  // ===================================
  // SEARCH
  // ===================================

  const [
    search,
    setSearch,
  ] =
    useState("");

  // ===================================
  // CURRENT ADMIN
  // ===================================

  const {
    data:
      currentUser,
  } =
    useCurrentUserQuery();

  // ===================================
  // GET USERS
  // ===================================

  const {
    data:
      users = [],

    isLoading,

    isError,

    refetch,
  } =
    useGetAllUsersQuery();

  // ===================================
  // MUTATIONS
  // ===================================

  const [
    updateUserRole,
    {
      isLoading:
        isUpdatingRole,
    },
  ] =
    useUpdateUserRoleMutation();

  const [
    deleteUser,
    {
      isLoading:
        isDeleting,
    },
  ] =
    useDeleteUserMutation();

  // ===================================
  // ACTIVE USER
  // ===================================

  const [
    processingUserId,
    setProcessingUserId,
  ] =
    useState<
      string | null
    >(null);

  // ===================================
  // FILTER
  // ===================================

  const filteredUsers =
    users.filter(
      (
        user:
          AdminUser
      ) => {

        const keyword =
          search
            .trim()
            .toLowerCase();

        if (!keyword) {
          return true;
        }

        return (
          user.name
            .toLowerCase()
            .includes(
              keyword
            ) ||
          user.email
            .toLowerCase()
            .includes(
              keyword
            ) ||
          user.role
            .toLowerCase()
            .includes(
              keyword
            )
        );
      }
    );

  // ===================================
  // ADMIN COUNT
  // ===================================

  const adminCount =
    users.filter(
      (
        user:
          AdminUser
      ) =>
        user.role ===
        "admin"
    ).length;

  // ===================================
  // CUSTOMER COUNT
  // ===================================

  const customerCount =
    users.filter(
      (
        user:
          AdminUser
      ) =>
        user.role ===
        "customer"
    ).length;

  // ===================================
  // CHANGE ROLE
  // ===================================

  const roleHandler =
    async (
      user:
        AdminUser
    ) => {

      const newRole =
        user.role ===
        "admin"
          ? "customer"
          : "admin";

      const actionText =
        newRole ===
        "admin"
          ? "give admin access to"
          : "remove admin access from";

      const confirmed =
        window.confirm(
          `Are you sure you want to ${actionText} ${user.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {

        setProcessingUserId(
          user._id
        );

        await updateUserRole({
          id:
            user._id,

          role:
            newRole,
        }).unwrap();

      } catch (
        error
      ) {

        const apiError =
          error as ApiError;

        alert(
          apiError
            ?.data
            ?.message ||
          "Unable to update user role"
        );

      } finally {

        setProcessingUserId(
          null
        );
      }
    };

  // ===================================
  // DELETE / KICK
  // ===================================

  const deleteHandler =
    async (
      user:
        AdminUser
    ) => {

      const confirmed =
        window.confirm(
          `Remove ${user.name} from FASHION KING?\n\nThis will permanently delete this account.`
        );

      if (!confirmed) {
        return;
      }

      try {

        setProcessingUserId(
          user._id
        );

        await deleteUser(
          user._id
        ).unwrap();

      } catch (
        error
      ) {

        const apiError =
          error as ApiError;

        alert(
          apiError
            ?.data
            ?.message ||
          "Unable to remove user"
        );

      } finally {

        setProcessingUserId(
          null
        );
      }
    };

  // ===================================
  // LOADING
  // ===================================

  if (isLoading) {

    return (
      <div
        className="
          flex
          min-h-100
          items-center
          justify-center
        "
      >
        <Loader2
          className="
            h-7
            w-7
            animate-spin
          "
        />
      </div>
    );
  }

  // ===================================
  // ERROR
  // ===================================

  if (isError) {

    return (
      <div
        className="
          flex
          min-h-100
          items-center
          justify-center
        "
      >
        <div
          className="
            text-center
          "
        >
          <p
            className="
              font-semibold
              text-red-500
            "
          >
            Failed to load users
          </p>

          <button
            type="button"
            onClick={
              () =>
                refetch()
            }
            className="
              mt-3
              rounded-md
              bg-black
              px-4
              py-2
              text-sm
              font-medium
              text-white
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        space-y-6
        pb-10
      "
    >

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <div>

        <h1
          className="
            text-2xl
            font-bold
          "
        >
          User Management
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          Manage users and their account roles
        </p>

      </div>

      {/* ============================= */}
      {/* STATS */}
      {/* ============================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-3
        "
      >

        {/* TOTAL */}

        <div
          className="
            rounded-xl
            border
            bg-background
            p-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Total Users
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                "
              >
                {users.length}
              </p>
            </div>

            <Users
              className="
                h-6
                w-6
                text-muted-foreground
              "
            />
          </div>
        </div>

        {/* ADMINS */}

        <div
          className="
            rounded-xl
            border
            bg-background
            p-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Admins
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                "
              >
                {adminCount}
              </p>
            </div>

            <Shield
              className="
                h-6
                w-6
                text-muted-foreground
              "
            />
          </div>
        </div>

        {/* CUSTOMERS */}

        <div
          className="
            rounded-xl
            border
            bg-background
            p-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div>
              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Customers
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                "
              >
                {customerCount}
              </p>
            </div>

            <Users
              className="
                h-6
                w-6
                text-muted-foreground
              "
            />
          </div>
        </div>

      </div>

      {/* ============================= */}
      {/* USERS TABLE */}
      {/* ============================= */}

      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-background
        "
      >

        {/* SEARCH */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            p-4
          "
        >

          <div
            className="
              relative
              w-full
              max-w-sm
            "
          >

            <Search
              className="
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-muted-foreground
              "
            />

            <input
              type="text"
              value={
                search
              }
              onChange={
                (
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
              }
              placeholder="Search users..."
              className="
                h-10
                w-full
                rounded-md
                border
                bg-background
                pl-9
                pr-3
                text-sm
                outline-none
                focus:ring-2
                focus:ring-ring
              "
            />

          </div>

          <p
            className="
              shrink-0
              text-sm
              text-muted-foreground
            "
          >
            {
              filteredUsers.length
            }{" "}
            users
          </p>

        </div>

        {/* TABLE */}

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              w-full
              text-left
            "
          >

            <thead
              className="
                border-b
                bg-muted/40
              "
            >
              <tr>

                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    uppercase
                    text-muted-foreground
                  "
                >
                  User
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    uppercase
                    text-muted-foreground
                  "
                >
                  Email
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-xs
                    font-semibold
                    uppercase
                    text-muted-foreground
                  "
                >
                  Role
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    text-muted-foreground
                  "
                >
                  Actions
                </th>

              </tr>
            </thead>

            <tbody
              className="
                divide-y
              "
            >

              {filteredUsers.map(
                (
                  user:
                    AdminUser
                ) => {

                  const isCurrentUser =
                    currentUser?._id ===
                    user._id;

                  const isProcessing =
                    processingUserId ===
                    user._id;

                  return (
                    <tr
                      key={
                        user._id
                      }
                      className="
                        transition-colors
                        hover:bg-muted/30
                      "
                    >

                      {/* USER */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >

                          {user
                            .avator
                            ?.url ? (

                            <img
                              src={
                                user
                                  .avator
                                  .url
                              }
                              alt={
                                user.name
                              }
                              className="
                                h-10
                                w-10
                                rounded-full
                                border
                                object-cover
                              "
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-muted
                                text-sm
                                font-bold
                                uppercase
                              "
                            >
                              {
                                user.name
                                  .charAt(
                                    0
                                  )
                              }
                            </div>
                          )}

                          <div>

                            <p
                              className="
                                font-medium
                              "
                            >
                              {
                                user.name
                              }

                              {isCurrentUser && (
                                <span
                                  className="
                                    ml-2
                                    text-xs
                                    text-muted-foreground
                                  "
                                >
                                  (You)
                                </span>
                              )}
                            </p>

                            {user.createdAt && (
                              <p
                                className="
                                  mt-0.5
                                  text-xs
                                  text-muted-foreground
                                "
                              >
                                Joined{" "}
                                {
                                  new Date(
                                    user.createdAt
                                  )
                                    .toLocaleDateString()
                                }
                              </p>
                            )}

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td
                        className="
                          px-4
                          py-4
                          text-sm
                        "
                      >
                        {
                          user.email
                        }
                      </td>

                      {/* ROLE */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold

                            ${
                              user.role ===
                              "admin"
                                ? "bg-black text-white"
                                : "bg-muted text-muted-foreground"
                            }
                          `}
                        >
                          {
                            user.role
                          }
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td
                        className="
                          px-4
                          py-4
                        "
                      >

                        <div
                          className="
                            flex
                            justify-end
                            gap-2
                          "
                        >

                          {/* ROLE BUTTON */}

                          <button
                            type="button"

                            disabled={
                              isCurrentUser ||
                              isProcessing ||
                              isUpdatingRole
                            }

                            onClick={
                              () =>
                                roleHandler(
                                  user
                                )
                            }

                            className={`
                              inline-flex
                              h-9
                              items-center
                              gap-2
                              rounded-md
                              border
                              px-3
                              text-xs
                              font-medium
                              transition-colors

                              ${
                                isCurrentUser
                                  ? "cursor-not-allowed opacity-40"
                                  : "hover:bg-muted"
                              }
                            `}
                          >

                            {isProcessing &&
                            isUpdatingRole ? (

                              <Loader2
                                className="
                                  h-4
                                  w-4
                                  animate-spin
                                "
                              />

                            ) : user.role ===
                              "admin" ? (

                              <ShieldOff
                                className="
                                  h-4
                                  w-4
                                "
                              />

                            ) : (

                              <Shield
                                className="
                                  h-4
                                  w-4
                                "
                              />
                            )}

                            {user.role ===
                            "admin"
                              ? "Remove Admin"
                              : "Make Admin"}

                          </button>

                          {/* DELETE BUTTON */}

                          <button
                            type="button"

                            disabled={
                              isCurrentUser ||
                              isProcessing ||
                              isDeleting
                            }

                            onClick={
                              () =>
                                deleteHandler(
                                  user
                                )
                            }

                            className={`
                              inline-flex
                              h-9
                              items-center
                              gap-2
                              rounded-md
                              border
                              border-red-200
                              px-3
                              text-xs
                              font-medium
                              text-red-600
                              transition-colors

                              ${
                                isCurrentUser
                                  ? "cursor-not-allowed opacity-40"
                                  : "hover:bg-red-50"
                              }
                            `}
                          >

                            {isProcessing &&
                            isDeleting ? (

                              <Loader2
                                className="
                                  h-4
                                  w-4
                                  animate-spin
                                "
                              />

                            ) : (

                              <Trash2
                                className="
                                  h-4
                                  w-4
                                "
                              />
                            )}

                            Kick

                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

              {/* EMPTY */}

              {filteredUsers.length ===
                0 && (

                <tr>

                  <td
                    colSpan={
                      4
                    }
                    className="
                      px-4
                      py-12
                      text-center
                      text-sm
                      text-muted-foreground
                    "
                  >
                    No users found.
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UserManagement;